import { PrismaClient } from "@prisma/client";
import { serializeArrayString } from "../app/helpers/string_arrays";
import { QuestionType } from "../app/types";
const db = new PrismaClient();

async function seed() {
  console.log("seeding");
  // Create the host
  const host = await db.host.create({
    data: {
      name: "The Quiz Host",
    },
  });
  console.log(host);

  // Create a quiz
  const quiz = await db.quiz.create({
    data: {
      name: "Threat Hunting Quiz #1",
      hostId: host.id,
    },
  });
  console.log(quiz);

  // Create some questions
  const questions = await Promise.all([
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 0,
        quizId: quiz.id,
        questionText:
          "GIFTS CAN NEVER BE BIG ENOUGH: The Statue of Liberty (the one in New York City) was a gift from which country",
        answer: "France",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 0.5,
        quizId: quiz.id,
        questionText:
          "SPEAKING OF FRANCE: If you were to go to a musical instruments shop in France and ask for a couple of “baguettes”, it would be totally normal. Why?",
        answer: "Baguette means stick, as in drum stick",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 0.8,
        quizId: quiz.id,
        questionText:
          "EDUCATED GUESS: Ketchup's original main ingredient was a different kind of vegetable (for over a century before the tomatoe). Which one?",
        answer: "Mushroom",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 1,
        quizId: quiz.id,
        questionText:
          "SPELLING BEE: We all know hummus, the delicious paste of mashed chickpeas blended with tahini, lemon juice, and garlic. But what is humus though?",
        answer: "Soil",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 1.5,
        quizId: quiz.id,
        questionText:
          "ALL PATHS LEAD TO ROME: It's football season again. (or as we like to call it in Europe: Hand egg season). This season's super bowl game is on Feb 12th. Which number of super bowl will it be? (one bonus point if you provide the roman numeral and its decimal representation)",
        answer: "57 - LVII",
      },
    }),
    db.question.create({
      data: {
        points: 4,
        type: QuestionType.freeForm,
        position: 2,
        quizId: quiz.id,
        questionText:
          "COMMIT OR STASH (get it right, get 4pts, get it wrong lose 4pts): if you choose to commit, name EITHER all 4 members of the Beatles OR all 4 Teenage Mutant Ninja Turtles.",
        answer:
          "Beatles: John Lennon, Paul McCartney, George Harrison, Ringo Starr, Turtles: Rafaello, Donatello, Michelangelo, Leonardo",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 3,
        quizId: quiz.id,
        questionText:
          "SPEED ROUND (15s): Name a song, any song, written by AC/DC.",
        answer: "Thunderstruck, Back in Black, Highway to hell...",
      },
    }),
    db.question.create({
      data: {
        points: 0.5,
        type: QuestionType.freeForm,
        position: 4,
        quizId: quiz.id,
        questionText:
          "MIX & MATCH (0.5 pts each): name 4 different chilli peppers, either from the Californian rock band (only current members) or actual chili peppers.",
        answer:
          "Anthony Kiedis, Flea, Chad Smith, John Frusciante....ghost, california reaper",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 5,
        quizId: quiz.id,
        questionText:
          'SHOW ME THE MONEY: what amount is mentioned on the infamous Monopoly card saying "Do not pass Go, do not collect ___$"?',
        answer: "$200",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 6,
        quizId: quiz.id,
        questionText:
          "QUICK DRAW (first team to answer correctly gets a point): a Smew is a type of what?",
        answer: "Bird / duck",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 7,
        quizId: quiz.id,
        questionText:
          "LOST IN TRANSLATION: In South Africa, if you ask someone for a napkin, what would they bring you?",
        answer: "A diaper",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 8,
        quizId: quiz.id,
        questionText: "IT'S A WORK THING: When did Elastic go public?",
        answer: "2018",
        answerOptions: serializeArrayString(["2016", "2017", "2018", "2019"]),
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 8.5,
        quizId: quiz.id,
        questionText:
          "DEFENSE: Why is it harder to score a three-point field goal in the NBA than in the European basketball leagues?",
        answer:
          "The arch is further away from the center of the basket (23 feet 9 inches (7.24 m) vs 22 ft 1.75 in(6.75 m)",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 9,
        quizId: quiz.id,
        questionText:
          "POLYGLOT: The team who knows how to write either “cheers” or “thank you” in the most amount of languages gets 5pts. Spelling doesn't matter (too much).",
        answer: "So many options....",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 10,
        quizId: quiz.id,
        questionText:
          "MICROSOFT ENCARTA: Which is the only country of South America where English is the official language?",
        answer: "Guyana",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 10.5,
        quizId: quiz.id,
        questionText:
          "GIT HISTORIAN: When was the Kibana repository created? (month and year)",
        answer:
          "22 May 2013 (https://github.com/elastic/kibana/commit/1e786c7c94a20f2ca0813d49947f1637a72d3699)",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 11,
        quizId: quiz.id,
        questionText:
          "TRUE OR FALSE: ca. 10% of internet traffic is encrypted using a stream of random numbers generated by some lava lamps in San Francisco.",
        answer:
          "TRUE (lava lamp random number generator at cloudflare) - https://www.youtube.com/watch?v=1cUUfMeOijg",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 13,
        quizId: quiz.id,
        questionText:
          "SPEED ROUND: (only first team to answer correctly wins 2pt) What is the fastest traveling human-made object ever made?",
        answerOptions: serializeArrayString([
          "An automobile",
          "an aircraft",
          "a rocket",
          "a satellite",
        ]),
        answer: "A satelite (Parker Solar Probe)",
      },
    }),
    db.question.create({
      data: {
        points: 0.5,
        type: QuestionType.freeForm,
        position: 14,
        quizId: quiz.id,
        questionText:
          "THE MORE THE MERRIER (0.5pt per answer): Name as many James Bond movies as you can.",
        answer: "So many options",
      },
    }),
    db.question.create({
      data: {
        points: 1,
        type: QuestionType.freeForm,
        position: 16,
        quizId: quiz.id,
        questionText:
          "LAST BUT NOT LEAST: What does ASMR stand for? (1pt per correct letter)",
        answer: "Autonomous Sensory Meridian Response",
      },
    }),
  ]);
  console.log(questions);

  console.log("Created all documents!");
}

seed();
