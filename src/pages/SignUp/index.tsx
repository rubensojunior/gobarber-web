import React, { useCallback } from 'react'
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import logo from '../../assets/logo.svg'

import Button from '../../components/Button'
import Input from '../../components/Input'

import { Container, Content, Background } from './styles'

const SignUp: React.FC = () => {
  const handleSubmit = useCallback(async (data: Record<string, any>) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(6, 'Nome deve ter no mínimo 6 dígitos'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('E-mail inválido'),
        password: Yup.string().min(6, 'Senha deve ter no mínimo 6 dígitos'),
      })

      await schema.validate(data, {
        abortEarly: false,
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <Container>
      <Background />
      <Content>
        <img src={logo} alt="GoBarber" />

        <Form onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />

          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href="create">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  )
}

export default SignUp
