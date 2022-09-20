/**
 * File: prismaPopulate.ts
 * Desc: This file is used to populate the database with some default
 * values. This must be run once and only once for the game to function.
 *
 * Copyright (C) 2022  Timothy Headrick
 *
 * This file is part of saols
 *
 * saols is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * saols is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {PrismaClient} from '@prisma/client';
import {parse} from 'csv-parse';
import fs from 'fs';

const prisma = new PrismaClient();

//populate BaseWeapons and default weapons
fs.createReadStream('./docs/par_weapon_stats.csv')
  .pipe(parse({delimiter: ',', from_line: 2}))
  .on('data', (row) => {
    prisma.baseWeapon
      .create({
        data: {
          //row just generates an array so values must be accessed by position
          type: row[1].replace(/[-\s]/g, '_').toUpperCase(),
          name: row[0],
          minLvl: parseInt(row[7]),
          baseWeight: parseInt(row[2]),
          baseAtk: parseInt(row[3]),
          basicAtkSpdCost: parseInt(row[6]),
          damagePerLvl: parseInt(row[5]),
          basePrice: parseInt(row[4]),
        },
      })
      .then((baseWeapon) => {
        //to avoid calculating multiple times calculate second part of weight
        //equation once for each baseWeapon.
        const weightCoef =
          (2.0 / 3.0) * Math.cbrt(baseWeapon.baseWeight / 50.0 - 1) +
          1.5 +
          (2.0 / 3.0) * Math.pow(baseWeapon.baseWeight / 50.0 - 1, 3);
        console.log(weightCoef);
        for (let i = baseWeapon.minLvl; i < 101; i++) {
          prisma.weapon
            .create({
              data: {
                name: baseWeapon.name,
                lvl: i,
                atk: baseWeapon.baseAtk + (i - 1) * baseWeapon.damagePerLvl,
                weight: Math.round(
                  baseWeapon.baseWeight + (i - 1) * weightCoef
                ),
                baseWeaponId: baseWeapon.id,
              },
            })
            .then((weapon) => console.log(weapon));
        }
      });
  });

//populate par_car table
fs.createReadStream('./docs/par_cor.csv')
  .pipe(parse({delimiter: ',', from_line: 1}))
  .on('data', (row) => {
    prisma.parCor
      .create({
        data: {
          //row just generates an array so values must be accessed by position
          lvl: parseInt(row[0]),
          value: parseInt(row[1]),
        },
      })
      .then((parCor) => console.log(parCor));
  });

//populate par_player_exp table
fs.createReadStream('./docs/par_player_exp.csv')
  .pipe(parse({delimiter: ',', from_line: 1}))
  .on('data', (row) => {
    prisma.parUserExp
      .create({
        data: {
          //row just generates an array so values must be accessed by position
          lvl: parseInt(row[0]),
          value: parseInt(row[1]),
        },
      })
      .then((parUserExp) => console.log(parUserExp));
  });

//populate par_weapon_exp table
fs.createReadStream('./docs/par_weapon_exp.csv')
  .pipe(parse({delimiter: ',', from_line: 1}))
  .on('data', (row) => {
    prisma.parWeaponExp
      .create({
        data: {
          //row just generates an array so values must be accessed by position
          lvl: parseInt(row[0]),
          value: parseInt(row[1]),
        },
      })
      .then((parWeaponExp) => console.log(parWeaponExp));
  });

prisma.$disconnect;
