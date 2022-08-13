import csv
from math import floor

MAX_LVL = 100
POINTS_PER_LVL = 3
STARTING_STR = 1
STARTING_AGI = 1
HANDLING_CUTOFF = 0.7
AGI_SPD_MULTIPLIER = 1


def calc_weight_from_lvl(original_weight, lvl):
    return original_weight + (lvl - 1) * (
        (2 / 3) * pow(original_weight / 50 - 1, 1 / 3).real
        + 1.5
        + (2 / 3) * pow(original_weight / 50 - 1, 3).real
    )


def calc_handling(weight, str):
    return (str + 32) / weight


def calc_encumberment_dmg(dmg, handling):
    return dmg * pow(handling, 2)


def calc_spd(handling, agi):
    return floor(handling * agi * AGI_SPD_MULTIPLIER + 39)


def calc_basic_atk_from_lvl(original_atk, atk_increase_per_lvl, lvl):
    return original_atk + (lvl - 1) * atk_increase_per_lvl


def calc_basic_atk_spam_dmg(spd, atk, atk_cost):
    return floor(spd / atk_cost) * atk


def calc_best_atk_combination_dmg(
    spd, atk, atk_cost, handling, sword_skills, combo_dmgs=[]
):
    combo_dmgs = []
    calc_all_skill_comb_dmgs(spd, atk, atk_cost, handling, sword_skills, combo_dmgs)
    return max(combo_dmgs)


def calc_all_skill_comb_dmgs(
    spd, atk, atk_cost, handling, sword_skills, combo_dmgs=[], cur_dmg=0
):
    for sword_skill in [
        *sword_skills,
        {
            "name": "bsc",
            "lvl": 1,
            "atk_mul": 1,
            "num_hits": 1,
            "min_handling": 0,
            "spd_cost": atk_cost,
        },
    ]:
        if sword_skill["spd_cost"] <= spd and sword_skill["min_handling"] <= handling:
            calc_all_skill_comb_dmgs(
                spd - sword_skill["spd_cost"],
                atk,
                atk_cost,
                handling,
                sword_skills,
                combo_dmgs,
                cur_dmg + atk * sword_skill["atk_mul"] * sword_skill["num_hits"],
            )
        else:
            combo_dmgs.append(cur_dmg)


def parse_weapon_csv(file_location):
    empty_list: list = []
    with open(file_location, newline="") as csvFile:
        csv_reader = csv.DictReader(
            csvFile, delimiter=",", quoting=csv.QUOTE_NONNUMERIC
        )
        for row in csv_reader:
            empty_list.append(row)
    return empty_list


def parse_sword_skill_csv(file_location):
    sword_skills: dict = {}
    cur_type = ""
    next_row_is_type = False
    with open(file_location, newline="") as csvFile:
        csv_reader = csv.DictReader(
            csvFile, delimiter=",", quoting=csv.QUOTE_NONNUMERIC
        )
        for row in csv_reader:
            if row["name"] == "":
                next_row_is_type = True
            elif next_row_is_type:
                cur_type = row["name"]
                sword_skills[cur_type] = []
                next_row_is_type = False
            else:
                sword_skills[cur_type].append(row)
    return sword_skills


def add_skill_to_weapon_skill_csv(file_location, weapon_type, weapon_skill):
    with open(file_location, "r", encoding="utf-8") as csv:
        lines = csv.readlines()
    for i in range(len(lines)):
        if lines[i].find(weapon_type) != -1:
            lines.insert(
                i + 1,
                f'"{weapon_skill["name"]}",{weapon_skill["lvl"]},{weapon_skill["atk_mul"]},{weapon_skill["num_hits"]},{weapon_skill["min_handling"]},{weapon_skill["spd_cost"]}',
            )
            break

    with open(file_location, "w", encoding="utf-8") as csv:
        for line in lines:
            csv.write(line)


def edit_skill_in_weapon_skill_csv(file_location, weapon_type, weapon_skill):
    with open(file_location, "r", encoding="utf-8") as csv:
        lines = csv.readlines()
    on_correct_weapon_type = (
        False  # in case there are duplicately named skills for different weapon types
    )
    for i in range(len(lines)):
        if lines[i].find(weapon_type) != -1:
            on_correct_weapon_type = True
        elif lines[i].find(",,,,,") != -1:
            on_correct_weapon_type = False
        elif lines[i].find(weapon_skill["name"]) != -1 and on_correct_weapon_type:
            lines[i] = (
                f'"{weapon_skill["name"]}",{weapon_skill["lvl"]},{weapon_skill["atk_mul"]},{weapon_skill["num_hits"]},{weapon_skill["min_handling"]},{weapon_skill["spd_cost"]}',
            )
            break

    with open(file_location, "w", encoding="utf-8") as csv:
        for line in lines:
            csv.write(line)


def get_dmg_and_place_of_weapon_per_lvl_from_file(file_location, weapon_name):
    lvl_dict = {}
    with open(file_location, encoding="utf-8") as dmg_file:
        lvl = 0
        dmg = 0
        place = 0
        for line in dmg_file:
            if "LVL " in line:
                lvl = int(
                    line[
                        line.index("LVL")
                        + 4 : line.index("LVL")
                        + 4
                        + line[line.index("LVL") + 4 :].index("-")
                    ]
                )
            if weapon_name in line:
                lvl_dict[lvl] = {
                    "dmg": int(line[line.index("DMG") + 5 : line.index(", SPD")]),
                    "place": int(line[0 : line.index(".")]),
                }
    return lvl_dict


def compare_weapon_place_dmg_dicts(original_dict, new_dict):
    for key in original_dict.keys():
        print(
            f'LVL {key}: dmg_change: {new_dict[key]["dmg"]/original_dict[key]["dmg"] * 100}% place_change: {original_dict[key]["place"] - new_dict[key]["place"]}'
        )


def calc_all_weapon_par_dmg_across_lvls(par_weapons, sword_skills=[]):
    for lvl in range(1, 101):
        builds = []
        available_pts = (lvl - 1) * POINTS_PER_LVL
        weapons_unlocked = [
            weapon for weapon in par_weapons if lvl >= weapon["unlock_lvl"]
        ]
        # total_calcs = available_pts * len(weapons_unlocked) + len(weapons_unlocked)
        for weapon in weapons_unlocked:
            weight = calc_weight_from_lvl(weapon["weight"], lvl)
            for agi in range(available_pts + 1):
                cur_agi = agi + STARTING_AGI
                cur_str = available_pts - agi + STARTING_STR
                handling = calc_handling(weight, cur_str)
                spd = calc_spd(handling, cur_agi)
                atk_dmg = calc_basic_atk_from_lvl(
                    weapon["base_dmg"], weapon["dmg_pl"], lvl
                )
                if weapon["type"] in sword_skills:
                    cur_dmg = calc_best_atk_combination_dmg(
                        spd,
                        atk_dmg,
                        weapon["basic_atk_cost"],
                        handling,
                        [
                            sword_skill
                            for sword_skill in sword_skills[weapon["type"]]
                            if sword_skill["lvl"] <= lvl
                        ],
                    )
                else:
                    cur_dmg = calc_best_atk_combination_dmg(
                        spd, atk_dmg, weapon["basic_atk_cost"], handling, []
                    )
                if handling < HANDLING_CUTOFF:
                    cur_dmg = calc_encumberment_dmg(cur_dmg, handling)
                cur_dmg = round(cur_dmg)
                if len(builds) == 0 or cur_dmg < builds[len(builds) - 1]["dmg"]:
                    builds.append(
                        {
                            "name": weapon["name"],
                            "agi": cur_agi,
                            "str": cur_str,
                            "dmg": cur_dmg,
                            "spd": spd,
                            "handling": handling,
                        }
                    )
                else:
                    for i in range(len(builds)):
                        if cur_dmg > builds[i]["dmg"]:
                            builds.insert(
                                i,
                                {
                                    "name": weapon["name"],
                                    "agi": cur_agi,
                                    "str": cur_str,
                                    "dmg": cur_dmg,
                                    "spd": spd,
                                    "handling": handling,
                                },
                            )
                            break
        named_weapons_added = []
        new_builds = []
        total_dmg_of_top_builds = 0
        for build in builds:
            if build["name"] not in named_weapons_added:
                new_builds.append(build)
                named_weapons_added.append(build["name"])
        print(f"------------------LVL {lvl}-----------------")
        for i in range(len(new_builds)):
            print(
                f"{i+1}. {new_builds[i]['name']}, AGI: {new_builds[i]['agi']}, STR: {new_builds[i]['str']}, DMG: {new_builds[i]['dmg']}, SPD: {new_builds[i]['spd']}, HANDLING: {new_builds[i]['handling']}"
            )
            total_dmg_of_top_builds += new_builds[i]["dmg"]
        print(
            f"AVG DMG ACROSS ALL TOP WEAPON BUILDS: {round(total_dmg_of_top_builds/len(new_builds))}"
        )


def calc_weapon_dmg_across_lvls(provided_weapon, sword_skills):
    for lvl in range(1, 101):
        builds = []
        available_pts = (lvl - 1) * POINTS_PER_LVL
        weapons_unlocked = [
            weapon for weapon in [provided_weapon] if lvl >= weapon["unlock_lvl"]
        ]
        print(f"-----------------LVL {lvl}-----------------------")
        # total_calcs = available_pts * len(weapons_unlocked) + len(weapons_unlocked)
        for weapon in weapons_unlocked:
            weight = calc_weight_from_lvl(weapon["weight"], lvl)
            for agi in range(available_pts + 1):
                cur_agi = agi + STARTING_AGI
                cur_str = available_pts - agi + STARTING_STR
                handling = calc_handling(weight, cur_str)
                spd = calc_spd(handling, cur_agi)
                cur_dmg = calc_basic_atk_from_lvl(
                    weapon["base_dmg"], weapon["dmg_pl"], lvl
                )

                cur_dmg = calc_best_atk_combination_dmg(
                    spd, cur_dmg, weapon["basic_atk_cost"], handling, sword_skills
                )
                if handling < HANDLING_CUTOFF:
                    cur_dmg = calc_encumberment_dmg(cur_dmg, handling)
                cur_dmg = round(cur_dmg)


def weapon_skill_creator(sword_skills, weapon_type):
    exitWSCreator = False

    while not exitWSCreator:
        name = input("Enter the name of your new skill: ")
        lvl = input("Enter lvl required to use your new skill: ")
        atk_mul = input("Enter what the attack multiplier for each hit will be: ")
        num_hits = input("Enter the number of hits: ")
        min_handling = input("Enter the minimum handling required to use this skill: ")
        spd_cost = input("Enter how much speed this skill will use: ")


def weapon_type_skill_printer(weapon_type):
    if len(weapon_type) > 0:
        # format at a table for the skills
        print("\nHere are the current skills for this weapon:\n")
        field_names = weapon_type[0].keys()
        format_row = "{:<15}" * len(field_names)
        print(format_row.format(*field_names))
        for sword_skill in weapon_type:
            print(format_row.format(*sword_skill.values()))
        print()
    else:
        print("This weapon currently has no skills.\n")


def weapon_type_selection_menu(sword_skills):
    sword_skills_index = 1
    print("Select weapon type:")
    for key in sword_skills.keys():
        print(f"{sword_skills_index}. {key}")
        sword_skills_index += 1
    print()
    weapon_type = input(f"Your choice (1-{sword_skills_index-1}): ")
    weapon_type = list(sword_skills.keys())[int(weapon_type) - 1]
    print(f"You selected: {weapon_type}")
    return weapon_type


def add_new_weapon_skill(sword_skills):
    print(
        """
--------------------------------------------------------------
==========WELCOME TO THE WEAPON SKILL CREATION TOOL===========
--------------------------------------------------------------"""
    )
    exitWSTool = False
    while not exitWSTool:
        weapon_type = weapon_type_selection_menu(sword_skills)
        weapon_type_skill_printer(sword_skills[weapon_type])
        weapon_skill_creator(sword_skills, weapon_type)

        exitChoice = input(
            "Would you like to create a skill for a different weapon type? (y/n): "
        )
        if exitChoice.lower() in ["y", "yes"]:
            exitWSTool = False
        else:
            exitWSTool = True


def main():
    par_weapons = parse_weapon_csv(
        "../docs/par_weapon_stats.csv",
    )
    sword_skills = parse_sword_skill_csv("../docs/sword_skills_min.csv")
    print(
        """
--------------------------------------------------------------
--------------------------------------------------------------
==========WELCOME TO THE SAO LINK START BALANCE TOOL==========
--------------------------------------------------------------
--------------------------------------------------------------

Select an option from the menu below by entering a number:
1. Recalculate all balance using csv's (slow).
2. Add a new weapon
3. Edit an existing weapon
4. Add a new weapon skill
5. Edit an existing skill
"""
    )
    selection = input("Your choice (1-5): ")
    if selection == "1":
        calc_all_weapon_par_dmg_across_lvls(par_weapons, sword_skills)
    elif selection == "2":
        pass
    elif selection == "3":
        pass
    elif selection == "4":
        print("You chose to add a new weapon skill")
        add_new_weapon_skill(sword_skills)

    # og = get_dmg_and_place_of_weapon_per_lvl_from_file("./og.dat", "Rapier")
    # new = get_dmg_and_place_of_weapon_per_lvl_from_file("./new.dat", "Rapier")
    # compare_weapon_place_dmg_dicts(og, new)
    #
    # calc_weapon_dmg_across_lvls(par_weapons[0], sword_skills["One-handed sword"])


if __name__ == "__main__":
    main()
