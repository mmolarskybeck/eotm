// src/stores/useGameStore.js
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    quiz: {
      answers: [],
      average: null,
      allOnes: false,
      flagged: false,
      completedAt: null,
    },
  }),
  actions: {
    recordQuizAnswers(answersArray) {
      const avg = answersArray.reduce((a, b) => a + b, 0) / answersArray.length

      this.quiz.answers = answersArray
      this.quiz.average = avg
      this.quiz.allOnes = answersArray.every((v) => v === 1)
      this.quiz.flagged = avg < 3 && !this.quiz.allOnes
      this.quiz.completedAt = Date.now()
    },
    resetQuiz() {
      this.quiz = {
        answers: [],
        average: null,
        allOnes: false,
        flagged: false,
        completedAt: null,
      }
    },
  },
  persist: true,
})
