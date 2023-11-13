-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_quizSessionId_fkey";

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_quizSessionId_fkey" FOREIGN KEY ("quizSessionId") REFERENCES "QuizSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
