import csv
from math import floor
from unicodedata import name

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
    sword_skills: list = {}
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


def main():
    par_weapons = parse_weapon_csv(
        "../docs/par_weapon_stats.csv",
    )
    sword_skills = parse_sword_skill_csv("../docs/sword_skills.csv")
    print(sword_skills)
    max_damage_per_lvl = {}
    for lvl in range(1, 101):
        builds = []
        top_3_builds = {1: ["", 0, 0, 0], 2: ["", 0, 0, 0], 3: ["", 0, 0, 0]}
        available_pts = (lvl - 1) * POINTS_PER_LVL
        weapons_unlocked = [
            weapon for weapon in par_weapons if lvl >= weapon["unlock_lvl"]
        ]
        # total_calcs = available_pts * len(weapons_unlocked) + len(weapons_unlocked)
        for weapon in weapons_unlocked:
            for agi in range(available_pts + 1):
                cur_agi = agi + STARTING_AGI
                cur_str = available_pts - agi + STARTING_STR
                handling = calc_handling(
                    calc_weight_from_lvl(weapon["weight"], lvl), cur_str
                )
                spd = calc_spd(handling, cur_agi)
                cur_dmg = calc_basic_atk_spam_dmg(
                    spd,
                    calc_basic_atk_from_lvl(weapon["base_dmg"], weapon["dmg_pl"], lvl),
                    weapon["basic_atk_cost"],
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
        max_damage_per_lvl[lvl] = top_3_builds
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


if __name__ == "__main__":
    main()