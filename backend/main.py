def print_trip_summary(
  destination,
  country,
  travel_month,
  days,
  travel_style,
  currency,
  budget,
  hotel_cost,
  food_cost,
  transport_cost,
  misc_cost
):

  total_estimated_cost = ( hotel_cost + food_cost + transport_cost + misc_cost )

  print("\n==================================================")
  print("                   KelanaAI")
  print("==================================================")

  print(f"Destination    : {destination}")
  print(f"Country        : {country}")
  print(f"Trip Month     : {travel_month}")
  print(f"Duration       : {days} days")
  print(f"Travel Style   : {travel_style}\n")
  print(f"Hotel Cost     : {currency} {hotel_cost}")
  print(f"Food Cost      : {currency} {food_cost}")
  print(f"Transport Cost : {currency} {transport_cost}")
  print(f"Misc. Cost     : {currency} {misc_cost}\n")
  print(f"Total Cost     : {currency} {total_estimated_cost}")
  print(f"Budget         : {currency} {budget}")

  if total_estimated_cost > budget:
    print(f"\nBudget exceeded.")

print(f"==================================================")
print(f"                  Trip Planner")
print(f"==================================================")

destination     = input("Enter destination city   : ")
country         = input("Enter destination country: ")
travel_month    = input("Enter trip month         : ")
days            = input("Enter duration (days)    : ")
travel_style    = input("Enter your travel style  : ")
currency        = input("Enter budget currency    : ")

print(f"\n==================================================")
print(f"             Trip Cost Estimation")
print(f"==================================================")

budget          = float(input(f"Enter your trip budget : {currency} "))
hotel_cost      = float(input(f"Hotel cost             : {currency} "))
food_cost       = float(input(f"Food cost              : {currency} "))
transport_cost  = float(input(f"Transport cost         : {currency} "))
misc_cost       = float(input(f"Misc. cost             : {currency} "))

print_trip_summary(destination, country, travel_month, days, travel_style, currency, budget, hotel_cost, food_cost, transport_cost, misc_cost)
