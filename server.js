import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import axios from 'axios'; 

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Rota inicial
app.get('/', (req, res) => {
    res.json({ mensagem: 'Olá do backend!' });
});

// === ROTAS DO ADMIN ===

// Rota de login do administrador
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await prisma.admin.findFirst({
            where: {
                nome: username,  // Nome do administrador
                password: password,  // Senha fornecida
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

// === ROTAS DE CONTATOS ===

// Criar novo contato
app.post('/contato', async (req, res) => {
    const { email, mensagem } = req.body;

    if (!email || !mensagem) {
        return res.status(400).json({ erro: 'Email e mensagem são obrigatórios' });
    }

    try {
        const novoContato = await prisma.contato.create({
            data: { email, mensagem },
        });

        return res.status(201).json(novoContato); // Retorna o contato criado
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao criar contato' });
    }
});

// Obter todos os contatos
app.get('/get-contatos', async (req, res) => {
    try {
        const contatos = await prisma.contato.findMany();  // 
        
        res.status(200).json(contatos); 

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar contatos' });
    }
});


// === ROTAS DE PARCERIAS ===

// Criar nova parceria
app.post('/parcerias', async (req, res) => {
    try {
        const { nome, idade, profissao, numero, email } = req.body;

        const novaParceria = await prisma.parcerias.create({
            data: { nome, idade, profissao, numero, email },
        });

        return res.status(201).json(novaParceria);  // Retorna a parceria criada
    } catch (erro) {
        console.error('Erro ao criar parceria:', erro);
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Obter todas as parcerias
app.get("/parcerias-get", async (req, res) => {
    try {
        const parcerias = await prisma.parcerias.findMany();

        if (parcerias.length === 0) {
            return res.status(404).json({ mensagem: "Nenhuma parceria encontrada." });
        }

        res.status(200).json(parcerias);  // Retorna as parcerias encontradas
    } catch (error) {
        console.error("Erro ao tentar buscar as parcerias:", error);
        res.status(500).json({ erro: "Erro interno ao buscar as parcerias" });
    }
});

// === ROTAS DE USUÁRIOS ===

// Criar novo usuário
app.post('/usuarios', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,  // Usando 'email' corretamente
                password: req.body.password,
            },
        });

        res.status(201).json(user);  // Retorna o usuário criado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Obter todos os usuários
app.get('/get-usuarios', async (req, res) => {
    try {
        const users = await prisma.user.findMany();  // Recupera todos os usuários do banco
        res.status(200).json(users);  // Retorna os usuários encontrados
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// === CONFIGURAÇÕES DO HELPSERVICE ===

//Cadastro de serviço
app.post('/servico', async (req, res) => {
    try {
        const servico = await prisma.servico.create({
             data: {
                servico: req.body.servico,
                descricao: req.body.descricao,
                categoria: req.body.categoria,
                preco: req.body.preco,
                pagamento: req.body.pagamento,
                email: req.body.email
             }
        })

        res.status(201).json(servico);
    } catch (error) {
        res.status(500).json({message: 'Erro ao tentar cadastrar serviço'})
    }
})

// Pegar serviços através da categoria

// excluir serviço

// editar serviço

//Criar uma categoria

app.post('/categoria', async (req, res) => {
    try {
        const categoria = await prisma.categorias.create({
            data: {
                nome: req.body.nome,
                sobre: req.body.sobre,
                email: req.body.email
            }
        })

        res.status(201).json(categoria)
    } catch (error) {
        res.status(500).json({message: 'Erro ao criar categoria'})
    }
})

//apagar categoria

//buscar categorias


//Criar conta profissional

app.post('/profissional', async (req, res) => {
    try {
        const profissional = await prisma.profissional.create({
            data: {
                email: req.body.email,
                senha: req.body.senha,
                telefone: req.body.telefone,
                cidade: req.body.cidade,
            }
        })

        res.status(201).json(profissional)
    } catch (error) {
        res.status(500).json({message: 'Erro ao tentar criar conta profissional'})
    }
})

//logar como profissiional

//excluir conta profissional 

//editar conta


//Usuario normal 

app.post('/contratante', async (req, res) => {
    try {
        const contratante = await prisma.user.create({
            data: {
                email: req.body.email,
                senha: req.body.senha,
                telefone: req.body.telefone,
                cidade: req.body.cidade,
            }
        })

        res.status(201).json(contratante)
    } catch (error) {
        res.status(500).json({message: 'Erro ao tentar criar conta como contratante'})
    }
})

// logar como contratante

// excluir conta como contratante

// editar conta contratante






// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

