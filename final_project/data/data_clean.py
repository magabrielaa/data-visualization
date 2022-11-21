import pandas as pd


provinces = pd.read_csv("province.csv")
gender = pd.read_csv("gender.csv")
print(provinces)

female_pop = 8844706
male_pop = 8665937
total_pop = female_pop + male_pop

male_pov = 566987
female_pov = 583565 
total_pov = 1150552

male_perc = male_pov/total_pov
female_perc = female_pov/total_pov



provinces['poor_total'] = provinces['extremely_poor'] + provinces['moderately_poor']

# Normalize data per 1.000 habitants
provinces['extreme_poor_norm'] = (provinces['extremely_poor'] / 1000).round(decimals = 2)
provinces['mod_poor_norm'] = (provinces['moderately_poor'] / 1000).round(decimals = 2)
provinces['poor_total_norm'] = (provinces['poor_total'] / 10000).round(decimals = 2)
provinces['female_poor_norm'] = (provinces['female_poor'] / 1000).round(decimals = 2)
provinces['male_poor_norm'] = (provinces['male_poor'] / 1000).round(decimals = 2)
provinces['female_poor_norm'] = (provinces['female_poor'] / 1000).round(decimals = 2)
provinces['no_ss_norm'] = (provinces['no_social_security'] / 1000).round(decimals = 2)
provinces['no_ss_norm'] = (provinces['no_social_security'] / 1000).round(decimals = 2)
provinces['disability_norm'] = (provinces['disability'] / 1000).round(decimals = 2)
provinces['illness_norm'] = (provinces['cat_illness'] / 1000).round(decimals = 2)

# Poverty by population
provinces['pov_by_pop'] = ((provinces['poor_total'] / provinces['population']) * 100).round(decimals = 2)

gender["gender_proportion"] = (gender["counts"] / gender["pop"]) * 100

provinces.to_csv("provinces_clean", encoding='utf-8', index=False)

