import React from 'react'
import JoinChallengePage from './JoinChallengePage'

export default function page(params: { params: { id: string } }) {

  return (
    <div>
        <JoinChallengePage params={{ id: params.params.id }} />
    </div>
  )
}