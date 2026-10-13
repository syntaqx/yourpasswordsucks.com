import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import * as zxcvbnCommon from "@zxcvbn-ts/language-common";
import * as zxcvbnEnglish from "@zxcvbn-ts/language-en";

const estimator = new ZxcvbnFactory({
  translations: zxcvbnEnglish.translations,
  graphs: zxcvbnCommon.adjacencyGraphs,
  dictionary: {
    "passwords-common": zxcvbnCommon.dictionary["passwords-common"],
    "commonWords-en": zxcvbnEnglish.dictionary["commonWords-en"],
    "firstnames-en": zxcvbnEnglish.dictionary["firstnames-en"],
    "lastnames-en": zxcvbnEnglish.dictionary["lastnames-en"],
    "cardinalNumbers-en": zxcvbnEnglish.dictionary["cardinalNumbers-en"],
    "ordinalNumbers-en": zxcvbnEnglish.dictionary["ordinalNumbers-en"],
    "daysOfWeek-en": zxcvbnEnglish.dictionary["daysOfWeek-en"],
    "months-en": zxcvbnEnglish.dictionary["months-en"],
    "seasons-en": zxcvbnEnglish.dictionary["seasons-en"],
    "timePeriods-en": zxcvbnEnglish.dictionary["timePeriods-en"],
    "rainbowColors-en": zxcvbnEnglish.dictionary["rainbowColors-en"],
    "directions-en": zxcvbnEnglish.dictionary["directions-en"],
    "intermediateDirections-en": zxcvbnEnglish.dictionary["intermediateDirections-en"],
    "sizeProgression-en": zxcvbnEnglish.dictionary["sizeProgression-en"],
    "militaryAlphabet-en": zxcvbnEnglish.dictionary["militaryAlphabet-en"],
    "planets-en": zxcvbnEnglish.dictionary["planets-en"],
    "zodiacSigns-en": zxcvbnEnglish.dictionary["zodiacSigns-en"],
    "chineseZodiac-en": zxcvbnEnglish.dictionary["chineseZodiac-en"],
  },
});

export function estimatePassword(password) {
  return estimator.check(password);
}
