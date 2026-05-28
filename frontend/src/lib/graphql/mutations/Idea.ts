import { gql } from "@apollo/client"

export const CREATE_IDEA = gql`
  mutation CreateIdea($data: CreateIdeaInput!) {
    createIdea(data: $data) {
      id
      title
      description
      authorId
      author {
        id
        name
        email
      }
      countVotes
      createdAt
      updatedAt
    }
  }
`

export const TOGGLE_VOTE = gql`
  mutation ToggleVote($ideaId: String!) {
    toggleVote(ideaId: $ideaId)
  }
`

export const ADD_COMMENT = gql`
  mutation AddComment($ideaId: String!, $data: CreateCommentInput!) {
    createComment(ideaId: $ideaId, data: $data) {
      id
      ideaId
      authorId
      author {
        id
        name
        email
      }
      content
      createdAt
      updatedAt
    }
  }
`
