import * as acceptLanguageParser from "accept-language-parser";

export function getPreferredLanguage(acceptLanguageHeader: string | null) {
  const parsedLanguages = acceptLanguageParser.parse(
    acceptLanguageHeader ?? "en"
  );
  if (parsedLanguages.length > 0) {
    return parsedLanguages[0].code;
  } else {
    return "en";
  }
}
