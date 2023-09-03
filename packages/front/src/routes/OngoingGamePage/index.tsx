import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { RenderedGame } from '../../games'

const StyledOngoingGamePage = styled.div``

export const OngoingGamePage = () => {
  const { gameId } = useParams()

  return (
    <StyledOngoingGamePage>
      <RenderedGame ongoingGameId={gameId} />
    </StyledOngoingGamePage>
  )
}
