'use client'

import { SignUpButton } from '@clerk/nextjs'
import React from 'react'

export default function Authorization() {
  return (
    <>
        <button className="bg-blue-500 rounded-2xl p-2 m-2">
        <SignUpButton />
        </button>
    </>
  )
}
