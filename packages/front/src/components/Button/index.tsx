import { FC, MouseEventHandler, ReactNode } from 'react'
import styled from 'styled-components'
import { theme } from '../../theme'

type ButtonProps = {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
  color?: keyof typeof theme.colors.foreground
} & React.HTMLAttributes<HTMLButtonElement>

const StyledButton = styled.button<{
  $color: keyof typeof theme.colors.foreground
}>`
  border-radius: 0.5rem;
  color: ${({ theme, $color }) => theme.colors.foreground[$color]};
  background: transparent;
  border: 1px solid ${({ theme, $color }) => theme.colors.foreground[$color]};
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.1s;
  &:hover {
    box-shadow: inset 0 0px 3px 0
      ${({ theme, $color }) => theme.colors.foreground[$color]};
  }
`

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  color,
  ...rest
}) => {
  return (
    <StyledButton $color={color || 'success'} onClick={onClick} {...rest}>
      {children}
    </StyledButton>
  )
}
