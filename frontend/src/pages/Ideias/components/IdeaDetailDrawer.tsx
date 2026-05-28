import { Drawer, DrawerContentRight } from "../../../components/ui/drawer"
import { useLazyQuery, useMutation } from "@apollo/client/react"
import { GET_IDEA } from "../../../lib/graphql/queries/Ideia"
import { useEffect, useState } from "react"
import { Idea } from "../../../types"
import { Button } from "../../../components/ui/button"
import { X } from "lucide-react"
import { CommentsList } from "./CommentsList"
import { CommentArea } from "./CommentArea"
import { CREATE_COMMENT } from "../../../lib/graphql/mutations/Comment"
import { toast } from "sonner"
import { TOGGLE_VOTE } from "../../../lib/graphql/mutations/Vote"

interface IdeaDetailDrawerProps {
  ideaId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IdeaDetailDrawer({
  open,
  onOpenChange,
  ideaId,
}: IdeaDetailDrawerProps) {
  const [commentContent, setCommentContent] = useState("")

  const [getIdeaQuery, { data, loading }] = useLazyQuery<{ getIdea: Idea }>(
    GET_IDEA
  )

  const [createCommentMutation] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_IDEA, variables: { ideaId } }],
    onCompleted: () => {
      setCommentContent("")
    },
  })

  const [toggleVoteMutation] = useMutation(TOGGLE_VOTE, {
    refetchQueries: [{ query: GET_IDEA, variables: { ideaId } }],
  })

  const handleToggleVote = () => {
    toggleVoteMutation({
      variables: {
        ideaId,
      },
    })
  }

  const handleAddComment = () => {
    if (!commentContent) toast.error("Por favor insira um comentário")

    createCommentMutation({
      variables: {
        ideaId,
        data: {
          content: commentContent,
        },
      },
    })
  }

  useEffect(() => {
    getIdeaQuery({
      variables: {
        ideaId,
      },
    })
  }, [ideaId])

  const { getIdea: idea } = data || {}

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContentRight className="flex flex-col rounded-l-2xl">
        <div className="flex-shrink-0 p-6 bg-slate-100 rounded-l-2xl">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold pr-4 flex-1">
              {idea?.title || "Carregando..."}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {idea && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {idea?.description || ""}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <CommentsList comments={idea?.comments || []} loading={loading} />
        </div>
        <CommentArea
          commentContent={commentContent || ""}
          setCommentContent={setCommentContent}
          handleAddComment={handleAddComment}
          handleVote={handleToggleVote}
          idea={idea}
        />
      </DrawerContentRight>
    </Drawer>
  )
}
