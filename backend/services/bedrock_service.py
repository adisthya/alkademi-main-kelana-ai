from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

import boto3
from botocore.client import BaseClient
from dotenv import load_dotenv


load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")


def configure_bedrock_client() -> BaseClient:
	"""Create a Bedrock Runtime client from environment variables."""
	region = os.getenv("AWS_REGION", "ap-southeast-2")

	access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
	secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
	session_token = os.getenv("AWS_SESSION_TOKEN")
	bearer_token = os.getenv("AWS_BEARER_TOKEN_BEDROCK")

	session_kwargs: dict[str, Any] = {"region_name": region}

	if access_key_id and secret_access_key:
		session_kwargs.update(
			aws_access_key_id=access_key_id,
			aws_secret_access_key=secret_access_key,
			aws_session_token=session_token,
		)
	elif bearer_token:
		session_kwargs.update(
			aws_access_key_id=bearer_token,
			aws_secret_access_key=bearer_token,
		)

	session = boto3.Session(**session_kwargs)
	return session.client("bedrock-runtime")


def configure_bedrock_api_key() -> BaseClient:
	"""Backward-compatible alias for Bedrock client configuration."""
	return configure_bedrock_client()


def _collect_text_blocks(value: Any) -> list[str]:
	if isinstance(value, str):
		return [value]

	if isinstance(value, list):
		text_parts: list[str] = []
		for item in value:
			text_parts.extend(_collect_text_blocks(item))
		return text_parts

	if isinstance(value, dict):
		text_parts: list[str] = []
		text = value.get("text")
		if isinstance(text, str) and text.strip():
			text_parts.append(text)

		for key in ("content", "citationsContent"):
			if key in value:
				text_parts.extend(_collect_text_blocks(value[key]))

		return text_parts

	return []


def _extract_text_from_response(response: dict[str, Any]) -> str:
	output = response.get("output", {})
	message = output.get("message", {})
	content = message.get("content", [])
	text_parts = _collect_text_blocks(content)

	if text_parts:
		return "\n".join(part.strip() for part in text_parts if part.strip()).strip()

	return json.dumps(response)


def _response_was_truncated(response: dict[str, Any]) -> bool:
	return response.get("stopReason") == "max_tokens"


def get_ai_recommendation(
	days: int,
	destination: str,
	currency: str,
	budget: float,
	travel_style: str,
  travel_month: str
) -> str:
	prompt = (
		f"As an experienced travel planner, arrange {days}-day itinerary for {destination}. With budget {currency} {budget}, travel style {travel_style}, and planned arrival on {travel_month}, arrange itinerarries in daily basis activities, include: daily budget estimation, local culinaries, cultural or historical sites, night life, and transport. Format your answer in clear and readable markdown."
	)

	client = configure_bedrock_client()
	selected_model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")
	messages = [
		{
			"role": "user",
			"content": [{"text": prompt}],
		}
	]
	response: dict[str, Any] = {}

	for _ in range(3):
		response = client.converse(
			modelId=selected_model_id,
			messages=messages,
			inferenceConfig={
				"maxTokens": 4096,
				"temperature": 0.7,
				"topP": 0.9,
			},
		)

		if not _response_was_truncated(response):
			break

		assistant_reply = _extract_text_from_response(response)
		if not assistant_reply:
			break

		messages.append(
			{
				"role": "assistant",
				"content": [{"text": assistant_reply}],
			}
		)
		messages.append(
			{
				"role": "user",
				"content": [
					{
						"text": "Continue exactly from where you stopped. Do not repeat previous text.",
					}
				],
			}
		)

	return _extract_text_from_response(response)
