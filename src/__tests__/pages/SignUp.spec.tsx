import React from 'react'
import { render, fireEvent, wait } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import api from '../../services/api'

import SignUp from '../../pages/SignUp'

const apiMock = new MockAdapter(api)

const mockedHistoryPush = jest.fn()
const mockedSignUp = jest.fn()
const mockedAddToast = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  }
})

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignUp,
    }),
  }
})

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  }
})

describe('SigIn page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear()
  })

  it('should be able to sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, {
      target: { value: 'Rubens' },
    })
    fireEvent.change(emailField, {
      target: { value: 'rubensojunior6@gmail.com' },
    })
    fireEvent.change(passwordField, { target: { value: '123123' } })

    fireEvent.click(buttonElement)

    apiMock.onPost('users').reply(200, {})

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/')
    })
  })

  it('should not be able to sign up with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, {
      target: { value: 'José' },
    })
    fireEvent.change(emailField, {
      target: { value: 'not-valid-email' },
    })
    fireEvent.change(passwordField, {
      target: { value: '123456' },
    })

    fireEvent.click(buttonElement)

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled()
    })
  })

  it('should display an error if sign up fails', async () => {
    apiMock.onPost('users').abortRequest()

    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, {
      target: { value: 'rubensojunior6' },
    })
    fireEvent.change(emailField, {
      target: { value: 'rubensojunior6@gmail.com' },
    })
    fireEvent.change(passwordField, {
      target: { value: '123456' },
    })

    fireEvent.click(buttonElement)

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      )
    })
  })
})
