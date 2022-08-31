# SAOLS Notes

Notes for the SAOLS program

## Program Flow

1. Check if any events in the database are expired if so, make sure to remove their rules if they exist.
2. Check if any events should already be started and have not been started.
   - Post tweet for event.
   - Save tweet id in database.
   - Mark event as started.
   - Add rule for event.
3. Schedule any events left for the day.
4. If no events are running and no events should be running today, schedule a random event.
5. Schedule interval to run each day at daily reset:
   - scheduling any events for that day and generating a random event if none are scheduled.
   - Mark any started events as done.
6. Start stream (if there are any events happening).
   - Try to keep stream in a client function that can be toggled on and off.
   - On tweet receive, call the handleEvent function.

### handleEvent function flow

1. Check database for event that is started with matching tweet_id saved.
2. Depending on event type, call type specific function for:
   - **Encounter**
   - **Market**
   - **Boss**

## Game Mechanics

- ### Encounter
  - An encounter has enemie(s). An enemy has a level, str, agi, and weapon\* (weapons are optional)
  - When attacking, the results are calculated as follow:
    - All enemy stats are calculated the same as players. If an enemy has a weapon, the weapon will be the exact same level as the enemy. Enemies cannot use sword skills. If an enemy does not have a weapon, their handling is 1.
  - In an encounter, users can reply with attack or forage.
    - **Attack**
      1.  Combat
          - During combat items may be used depending on what the items effect is. See "Items" for a list of currently implemented items.
      2.  Assuming the player survives, they receive exp, cor, and a chance at items. Enemies with weapons have a chance of dropping their weapon.
    - **Forage**
      1.  The player will receive more cor than possible from combat, but a significantly smaller amount of exp. There is a small chance to receive any item or weapon (at or below their lvl) currently in the game.
      - In either of these cases if a player receives some drop(s), the bot will reply to their action tweet telling them the drop(s) they received.
- ### Market
  - Two items will be on sale with a limited stock for the entire player base.
  - Items can be weapons or general items.
  - Purchasable weapons will have three different keyword identifiers: dull, normal, well-maintained, exquisite. These keywords denote how close the weapon will be in level to the player when purchased.
    - Dull: between [5-3 levels under the player]
    - Normal: between [ 4-2 levels under the player]
    - Well-maintained: between [3-1 levels under the player]
    - Exquisite: [the players level]
    - Generally price will increase and stock will decrease as weapons improve
  - To buy one or both of the items players reply with a tweet containing "buy" and the numbers for the item they want to buy. For example, a player can reply with something like "I want to buy option 1 and 2."
  - Currently, no reply mechanism is built in because of a risk of posting too many tweets and being throttled.
- ### Boss

  - Bosses take place over the course of three tweets in one day.
  - Players have until the boss fight is over or the end of the entire boss fight is reached to reply to each of the three tweets.
  - Fight flow:
    1. Tweet posted and all players are given the chance to attack, tank, or support for a limited window.
    2. Boss will deal damage to all participants.
    3. Next tweet is posted with an update on boss's current health and how much damage it dealt to each player.
    4. Repeat 1-3 once.
    5. For final tweet some special conditions take place:
       - Any players that have not participated up to this point can reply to previous tweets to make an action that will apply to this final phase. (Ie if a player skipped the first two tweets, they could now go through all tweets and choose to "attack, tank, attack").
  - Choosing to attack, tank, or support has the following effects (players only receive award bonuses by taking their action during that tweets original limited run):
    - Attack: Player deals damage to the boss calculated as usual. Increases exp gain at end of boss fight significantly player gains very small chance at receiving rare drop after boss fight.
    - Tank: Take 1.5 times what an average player would take when boss deals damage, also . moderate increase to item drop chance, cor received, and weapon skill exp for currently used weapon.
    - Support: Player protects ten other players from dying in case of losing the boss fight. takes no damage from current phase, immunity from death for losing boss fight, slight increase to item drop chance and cor received, moderate increase to weapon skill exp for currently used weapon.
  - If a boss fight is lost, players who never took a support action will be killed unless protected by a player that chose to support. This chance is random for now (may be guild based in the future).
  - The damage the boss deals for each phase is based on the following formula: $dmg = [(hpa - 3*hpoftanks) * rand(0.2,0.3)] * BDC$
    - BDC stands for boss damage coefficient, a hidden value that adds some uniqueness to how much dmg a boss does.
    - In writing this translates to total boss damage is hp of all active saols players combined, minus three times the hp of all tanks that participated times a random value between 0.2 to 0.3, times the BDC.
    - This is subject to change depending on the boss but acts as a baseline.
  - Boss health is: $hp=dpta*2*BHPC$
    - dpta is the damage per turn of all active players combined.
    - BHPC is the boss health coefficient, which acts similarly to the BDC.
  - dmg is just divided by all players that participated in that tweet during the time frame and dealt to each player that participated. There is no dodging in boss fights.
  - The player that deals the killing blow on the boss will receive the last attack bonus item. This item is one of a kind for each boss. The player that receives it and the item details will be included in the boss defeated tweet.
    - This player receives the "avenger" feat.
    - If this player is also a beta tester, they receive the "beater" feat.
  - The tank that contributes the most receives the "merchant" feat.
  - If a player supports during all three phases of the boss fight they receive the "bard" feat. This feat has no effect in the current version.
  - General rare drop item pools are also unique for each boss. Players that receive a rare drop will have their most recent action tweet replied to.
  - All boss drops are at or above the players level (capping out at whatever the highest level player is). Levels trend closer to the player's level.

- ### Players/Users
  - have a lvl, hp, agi, str, weapon(s), item(s), sword skill(s), and weapon skill(s)
  - A player cannot attack without a weapon by default.
    - They must have the martial arts weapon skill.
  - Each lvl a player gets 3 points to allocate to agi and str.
  - Health scales with str and lvl according to: $hp={(str+29)\over30}(248 + \sum_{i=1}^{lvl}{(2i)})$.
    - See a reference table below
  - Players can receive various feats while playing SAOLS. All feats have associated effects. Many feats have their effects hidden. The effects associated with this feats may be discovered in time.
- ### Weapons

  - have a lvl, weight, attack (atk), basic attack spd cost, per/lvl dmg increase, and base price
  - Weight can be: 1-100, 50 is considered average weight.
  - A weapon can only be equipped by someone of equal or higher lvl than the weapon.
  - Weapons become more unwieldy the higher lvl they are.
    What this translates to is the weight scales to the lvl
    using the following equation (ow refers to original weight or lvl 1 weight):

    - $w=ow+(lvl-1)(\frac{2}{3}\left(\frac{ow}{50}-1\right)^{\frac{1}{3}}+1.5\ +\frac{2}{3}\left(\frac{ow}{50}-1\right)^{3})$
      - For reference, here is a table of weights and their corresponding increase in real weight per lvl:

    > | w        | 1    | 10   | 25   | 40   | 50   | 60   | 75   | 90   | 100  |
    > | -------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
    > | (rw)/lvl | 0.21 | 0.54 | 0.89 | 1.10 | 1.50 | 1.90 | 2.11 | 2.46 | 2.83 |

    - This makes light weapons stay light so agi types are effective.
    - It also makes heavy weapons only practicaly for str builds.
    - Meanwhile, an average weapon will increase on par to an average build (1.5 str/agi per lvl).
    - Old function: $w=ow+{3(lvl-1)ow \over 100}$

  - When using a weapon, a handling score is calculated, which is used for various tests:
    - $h={(str+32)\over w}$
  - How much damage a weapon done is simply its attack.
    - Beyond this, damage can only be increased by sword skills.
    - However, damage can be decreased by not being able to handle a weapon i.e $h < 0.7$.

- ### Sword Skills

  - have a lvl, attack multiplier (atm), number of hits, required weapon type, required weapon skill, minimum handling requirement, and spd cost
  - A sword skill is unable to be unlocked until its corresponding weapon skill >= its lvl.
  - A sword skill can only be used by a weapon with a lvl >= sword skill lvl.
    - Potential update: Add durability but to weapons. Using a sword skill on a weapon that is lower level than the skill uses durability.
  - A sword skill's damage upon use: $dmg= atk*atm*numhits$.

- ### Combat

  - A calculated speed for each combatant decides attack order, acts as a limited currency for attacks per turn, and determines dodge chance.
    - Speed depends on handling and agi (or str, agi, and weapon real_weight, but agi matters most by far).
    - $spd=h*agi+39$
  - There is also the following caveat, though, if $h < 0.7$:
    - An extra debuff to your damage is applied: $dmg=dmg*h^2$
    - This pushes players to only use weapons they can handle.
  - Turn order is simply higher speeds going before lower speeds, there is no further complexity to it.
  - On your turn, all your speed is used to attack. This will be a combination of basic attacks and sword skills.
  - Once all your speed is used, the next combatant attacks.
    - This cycle repeats until all enemies or you are defeated.
  - For each incoming attack you have a chance to dodge calculated by: $dc=1-{theirSpeed \over yourSpeed}$
    - Dodge chance is always at least 0.01 or 1%.
  - Damage ceiling
    - There is a damage ceiling for each level. This is not enforced in the sense that if you deal over
      the damage ceiling your damage is cutoff, but the game is intended to be designed in a way that
      it is not possible to pass this ceiling for your level no matter what combination of items, weapons,
      skills, and stats you have. If this damage ceiling happens to be passed for some non-bug related
      reason, that is fine.
    - The game is designed with the intention that doing even half the damage of the damage ceiling is considered very good.
    - Boss health may take the damage ceiling into consideration.

- ### Daily Reset

  - All players health restored to 80% if below.
  - The Monument of Swordsmen tweet(s) are posted, which list all players ranking sorted by total damage done in their time playing. The following information is also included for each player:
    - their lvl, agi, and spd
    - their cor
    - their weapon and its stats
    - their most used sword skill

- ### Enemies

  - Enemy health is calculated based on: $hp=avgdpt * 3 * HPC * modifier$
    - $avgdpt$ is the average damage per turn of entire active player base.
    - HPC is the health coefficient that modfies enemy health based on the enemy.
    - modifier is depending on the enemy's title.
  - Enemy damage is calculated the same as players. Weak and normal enemies will be given random strength and agi stats based on their lvl. If they have a weapon, it will also be their level.
  - title effects:
    - weak: modifier is rand(0.5,0.9). Decrease cor, weapon, and exp drops.
    - normal: modifier is 1. normal drops.
    - strong: modifier is rand(1,1.5). Agi and Str are 10th strongest possible build. Increase cor, item, and exp drops.
    - menacing: modifier is rand(2, 3). Agi and Str are 5th strongest possible build. Majorly increase cor, item, and exp drops. Slim chance to get rare drops.
    - nightmare: modifier is rand(3, 5). Agi and Str are strongest possible build. Majorly increase exp drops. Massively increase cor and item drops. Moderate chance to get rare drops. Players receive the "clearer" feat if they defeat the enemy without using items.

- ### Items

  - have a base price
  - Current Items (items marked with "\*" can be dropped by enemies):
    - Health potion: heals player if they would otherwise be killed by an attack. Cannot prevent one shots (ie goes from health at beginning of combat to 0 during enemy's first turn).
    - Bread: Fully restores player health at end of the day.

- ### Miscellaneous
  - Any player that replies first to a tweet receives the "hero" feat.

## Inconsistencies With SAO

- Health scaling is a bit different in SAOLS
  - Tbh in what game does a lvl 1 start at 250hp and end with only 18,600hp as a more strength-ish build? Seems whack.
  - I would estimate that health in SAOLS is consistently about 2.5x what it would be in actual SAO.
- Weapons in sao have durability as well as bonuses to str and agi
  - Durability tends to be a bother especially in something less interactive like this (weapons likely wouldn't be used enough to break anyways.
  - The str and agi bonuses significantly increase balancing concerns (maybe a future update?).

## Reference Tables

### <a name="hp-table"></a>HP Scaling (COL1: STR, ROW1: LVL)

|     | 1    | 10   | 20   | 30    | 40    | 50    | 60    | 70    | 80    | 90    | 100    |
| --- | ---- | ---- | ---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ------ |
| 1   | 250  | 358  | 668  | 1178  | 1888  | 2798  | 3908  | 5218  | 6728  | 8438  | 10348  |
| 10  | 325  | 465  | 868  | 1531  | 2454  | 3637  | 5080  | 6783  | 8746  | 10969 | 13452  |
| 20  | 408  | 585  | 1091 | 1924  | 3084  | 4570  | 6383  | 8523  | 10989 | 13782 | 16902  |
| 30  | 492  | 704  | 1314 | 2317  | 3713  | 5503  | 7686  | 10262 | 13232 | 16595 | 20351  |
| 40  | 575  | 823  | 1536 | 2709  | 4342  | 6435  | 8988  | 12001 | 15474 | 19407 | 23800  |
| 50  | 658  | 943  | 1759 | 3102  | 4972  | 7368  | 10291 | 13741 | 17717 | 22220 | 27250  |
| 60  | 742  | 1062 | 1982 | 3495  | 5601  | 8301  | 11594 | 15480 | 19960 | 25033 | 30699  |
| 70  | 825  | 1181 | 2204 | 3887  | 6230  | 9233  | 12896 | 17219 | 22202 | 27845 | 34148  |
| 80  | 908  | 1301 | 2427 | 4280  | 6860  | 10166 | 14199 | 18959 | 24445 | 30658 | 37598  |
| 90  | 992  | 1420 | 2650 | 4673  | 7489  | 11099 | 15502 | 20698 | 26688 | 33471 | 41047  |
| 100 | 1075 | 1539 | 2872 | 5065  | 8118  | 12031 | 16804 | 22437 | 28930 | 36283 | 44496  |
| 110 | 1158 | 1659 | 3095 | 5458  | 8748  | 12964 | 18107 | 24177 | 31173 | 39096 | 47946  |
| 120 | 1242 | 1778 | 3318 | 5851  | 9377  | 13897 | 19410 | 25916 | 33416 | 41909 | 51395  |
| 130 | 1325 | 1897 | 3540 | 6243  | 10006 | 14829 | 20712 | 27655 | 35658 | 44721 | 54844  |
| 140 | 1408 | 2017 | 3763 | 6636  | 10636 | 15762 | 22015 | 29395 | 37901 | 47534 | 58294  |
| 150 | 1492 | 2136 | 3986 | 7029  | 11265 | 16695 | 23318 | 31134 | 40144 | 50347 | 61743  |
| 160 | 1575 | 2255 | 4208 | 7421  | 11894 | 17627 | 24620 | 32873 | 42386 | 53159 | 65192  |
| 170 | 1658 | 2375 | 4431 | 7814  | 12524 | 18560 | 25923 | 34613 | 44629 | 55972 | 68642  |
| 180 | 1742 | 2494 | 4654 | 8207  | 13153 | 19493 | 27226 | 36352 | 46872 | 58785 | 72091  |
| 190 | 1825 | 2613 | 4876 | 8599  | 13782 | 20425 | 28528 | 38091 | 49114 | 61597 | 75540  |
| 200 | 1908 | 2733 | 5099 | 8992  | 14412 | 21358 | 29831 | 39831 | 51357 | 64410 | 78990  |
| 210 | 1992 | 2852 | 5322 | 9385  | 15041 | 22291 | 31134 | 41570 | 53600 | 67223 | 82439  |
| 220 | 2075 | 2971 | 5544 | 9777  | 15670 | 23223 | 32436 | 43309 | 55842 | 70035 | 85888  |
| 230 | 2158 | 3091 | 5767 | 10170 | 16300 | 24156 | 33739 | 45049 | 58085 | 72848 | 89338  |
| 240 | 2242 | 3210 | 5990 | 10563 | 16929 | 25089 | 35042 | 46788 | 60328 | 75661 | 92787  |
| 250 | 2325 | 3329 | 6212 | 10955 | 17558 | 26021 | 36344 | 48527 | 62570 | 78473 | 96236  |
| 260 | 2408 | 3449 | 6435 | 11348 | 18188 | 26954 | 37647 | 50267 | 64813 | 81286 | 99686  |
| 270 | 2492 | 3568 | 6658 | 11741 | 18817 | 27887 | 38950 | 52006 | 67056 | 84099 | 103135 |
| 280 | 2575 | 3687 | 6880 | 12133 | 19446 | 28819 | 40252 | 53745 | 69298 | 86911 | 106584 |
| 290 | 2658 | 3807 | 7103 | 12526 | 20076 | 29752 | 41555 | 55485 | 71541 | 89724 | 110034 |
| 300 | 2742 | 3926 | 7326 | 12919 | 20705 | 30685 | 42858 | 57224 | 73784 | 92537 | 113483 |

### <a name="par-weapon-table"></a>Par Stats for Lvl 1 Weapons

|                         | base_weight | base_atk | base_price | dmg increase per lvl ovr 1 | basic_attack_cost | unlock level |
| ----------------------- | ----------- | -------- | ---------- | -------------------------- | ----------------- | ------------ |
| One-handed sword        | 33          | 25       |            | 11                         | 24                | 1            |
| One-handed curved sword | 25          | 17       |            | 7.5                        | 19                | 5            |
| One-handed axe          | 40          | 35       |            | 13                         | 26                | 10           |
| Two-handed battle axe   | 90          | 150      |            | 55                         | 36                | 25           |
| Two-handed sword        | 75          | 100      |            | 28                         | 26                | 10           |
| Rapier                  | 15          | 9        |            | 4                          | 13                | 15           |
| Dagger                  | 10          | 4        |            | 2.15                       | 10                | 1            |
| Claws                   | 5           | 3        |            | 0.75                       | 5                 | 50           |
| Katana                  | 38          | 35       |            | 14                         | 30                | 20           |
| Mace                    | 60          | 35       |            | 16                         | 30                | 35           |
| Spear                   | 45          | 75       |            | 16                         | 28                | 25           |

### <a name="max-damage-table"></a>Damage Ceiling Per Lvl

|        |        |        |        |        |        |        |        |         |         |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- |
| **1**  | **2**  | **3**  | **4**  | **5**  | **6**  | **7**  | **8**  | **9**   | **10**  |
| 540    | 583    | 630    | 680    | 735    | 793    | 857    | 925    | 1000    | 1079    |
|        |        |        |        |        |        |        |        |         |         |
| **11** | **12** | **13** | **14** | **15** | **16** | **17** | **18** | **19**  | **20**  |
| 1166   | 1259   | 1360   | 1469   | 1586   | 1713   | 1850   | 1998   | 2158    | 2330    |
|        |        |        |        |        |        |        |        |         |         |
| **21** | **22** | **23** | **24** | **25** | **26** | **27** | **28** | **29**  | **30**  |
| 2517   | 2718   | 2936   | 3171   | 3424   | 3698   | 3994   | 4314   | 4659    | 5031    |
|        |        |        |        |        |        |        |        |         |         |
| **31** | **32** | **33** | **34** | **35** | **36** | **37** | **38** | **39**  | **40**  |
| 5434   | 5869   | 6338   | 6845   | 7393   | 7984   | 8623   | 9313   | 10058   | 10862   |
|        |        |        |        |        |        |        |        |         |         |
| **41** | **42** | **43** | **44** | **45** | **46** | **47** | **48** | **49**  | **50**  |
| 11731  | 12670  | 13683  | 14778  | 15960  | 17237  | 18616  | 20105  | 21714   | 23451   |
|        |        |        |        |        |        |        |        |         |         |
| **51** | **52** | **53** | **54** | **55** | **56** | **57** | **58** | **59**  | **60**  |
| 25327  | 27353  | 29541  | 31905  | 34457  | 37213  | 40191  | 43406  | 46878   | 50629   |
|        |        |        |        |        |        |        |        |         |         |
| **61** | **62** | **63** | **64** | **65** | **66** | **67** | **68** | **69**  | **70**  |
| 54679  | 59053  | 63777  | 68880  | 74390  | 80341  | 86768  | 93710  | 101207  | 109303  |
|        |        |        |        |        |        |        |        |         |         |
| **71** | **72** | **73** | **74** | **75** | **76** | **77** | **78** | **79**  | **80**  |
| 118047 | 127491 | 137691 | 148706 | 160602 | 173450 | 187326 | 202313 | 218498  | 235977  |
|        |        |        |        |        |        |        |        |         |         |
| **81** | **82** | **83** | **84** | **85** | **86** | **87** | **88** | **89**  | **90**  |
| 254856 | 275244 | 297264 | 321045 | 346728 | 374467 | 404424 | 436778 | 471720  | 509458  |
|        |        |        |        |        |        |        |        |         |         |
| **91** | **92** | **93** | **94** | **95** | **96** | **97** | **98** | **99**  | **100** |
|        |
| 550214 | 594231 | 641770 | 693111 | 748560 | 808445 | 873121 | 942970 | 1018408 | 1099881 |
