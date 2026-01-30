import { gql } from "apollo-server";

export const typeDefs = gql`
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  type Question {
    id: ID!
    type: QuestionType!
    label: String!
    options: [String] # Для MULTIPLE_CHOICE та CHECKBOX
  }

  input QuestionInput {
    type: QuestionType!
    label: String!
    options: [String]
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Answer {
    questionId: ID!
    value: [String!]! # Масив, бо в CHECKBOX може бути кілька відповідей
  }

  input AnswerInput {
    questionId: ID!
    value: [String!]!
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(
      title: String!
      description: String
      questions: [QuestionInput]
    ): Form!
    submitResponse(formId: ID!, answers: [AnswerInput]): Response!
  }
`;
