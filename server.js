import express from 'express'
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

import axios from 'axios'; 

const prisma = new PrismaClient()

const app = express()
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json({ mensagem: 'Olá do backend!' });
});

//ROTAS DO SITE VIONTECH CONTATO

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Procurar o administrador com nome e senha fornecidos
        const admin = await prisma.admin.findFirst({
            where: {
                nome: username,  // Campo 'nome' para o nome do administrador
                password: password,  // Agora utilizando 'password' em vez de 'senha'
            },
        });

        if (!admin) {
            return res.status(404).json({ message: 'Administrador não encontrado ou credenciais incorretas' });
        }

        res.status(200).json({ message: 'Login de administrador bem-sucedido!', admin });
    } catch (error) {
        console.error('Erro ao tentar logar como administrador:', error);
        res.status(500).json({ error: 'Erro ao tentar logar como administrador', detalhes: error.message });
    }
});




app.post('/contato', async (req, res) => {
    const { email, mensagem } = req.body;

    if (!email || !mensagem) {
        return res.status(400).json({ erro: 'Email e mensagem são obrigatórios' });
    }

    try {
        const novoContato = await prisma.contato.create({
            data: {
                email,
                mensagem,
            },
        });

        return res.status(201).json(novoContato); // Retorna o contato criado
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao criar contato' });
    }
});

// Rota para obter todos os contatos
app.get('/contatos', async (req, res) => {
    try {
        // Buscar todos os registros de Contato no banco de dados
        const contatos = await prisma.contato.findMany();

        // Retornar os contatos encontrados com status 200
        res.status(200).json(contatos);
    } catch (error) {
        console.error('Erro ao buscar contatos:', error);
        res.status(500).json({ error: 'Erro ao buscar contatos', detalhes: error.message });
    }
});


app.post('/parcerias', async (req, res) => {
    try {
      const { nome, idade, profissao, numero, email } = req.body;
  
      // Criar a parceria no banco de dados
      const novaParceria = await prisma.parcerias.create({
        data: {
          nome,
          idade,
          profissao,
          numero,
          email,
        },
      });
  
      // Enviar resposta de sucesso
      return res.status(201).json(novaParceria);
    } catch (erro) {
      console.error('Erro ao criar parceria:', erro);
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});
  
app.get("/parcerias-get", async (req, res) => {
try {
    // Buscar todas as parcerias no banco de dados
    const parcerias = await prisma.parcerias.findMany(); // Utiliza o Prisma para pegar todas as parcerias

    // Se não encontrar nenhuma parceria, retorna uma resposta adequada
    if (parcerias.length === 0) {
    return res.status(404).json({ mensagem: "Nenhuma parceria encontrada." });
    }

    // Caso haja parcerias, retornamos elas
    res.status(200).json(parcerias);
} catch (error) {
    console.error("Erro ao tentar buscar as parcerias:", error);
    res.status(500).json({ erro: "Erro interno ao buscar as parcerias" });
}
});


//ROTAS DO USUARIO

app.post('/usuarios', async (req, res) => {
    try {
        // Corrigindo o nome do campo de 'amail' para 'email'
        const user = await prisma.user.create({
            data: {
                email: req.body.email,  // Usando 'email' corretamente
                password: req.body.password
            }
        });

        res.status(201).json(user);  // Retorna os dados do novo usuário criado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});


app.get('/get-usuarios', async (req, res) => {
    try {
        const users = await prisma.user.findMany();  // Recupera todos os usuários do banco
        res.status(200).json(users);  // Retorna os usuários
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});


//ROTAS DO SERVIÇO


//ROTAS DE CATEGORIAS


//ROTAS DE CONFIGURAÇÕES






const PORT = process.env.PORT || 3001; app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

//DAR UM NPX PRISMA DB PUSH 07:33 DIA 17.02.25