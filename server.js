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
                identificacao: req.body.identificacao
             }
        })

        res.status(201).json(servico);
    } catch (error) {
        res.status(500).json({message: 'Erro ao tentar cadastrar serviço'})
    }
})

// Pegar serviços através da categoria

app.get('/get-servicos', async (req, res) => {
    try {
        const servicos = await prisma.servico.findMany();  // Recupera todos os serviços do banco
        res.status(200).json(servicos);  // Retorna os serviços encontrados
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar serviços' });
    }
});

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

app.get('/get-categorias', async (req,res) => {
    try {
        const categorias = await prisma.categorias.findMany();

        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({message: 'erro ao procurar categorias.'})
    }
})


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

app.post('/profissional/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const admin = await prisma.profissional.findFirst({
            where: {
                email: email,  // Nome do administrador
                senha: senha,  // Senha fornecida
            },
        });

        if (!admin) {
            return res.status(404).json({ message: 'perfil não encontrado ou credenciais incorretas' });
        }

        res.status(200).json({ message: 'Login de contratante bem-sucedida!', admin });
    } catch (error) {
        console.error('Erro ao tentar logar como contratante:', error);
        res.status(500).json({ error: 'Erro ao tentar logar como contratante', detalhes: error.message });
    }
});

// pegar dados do profissional

app.get('/get-profissionais', async (req, res) => {
    try {
        const profissional = await prisma.profissional.findMany();  // 
        
        res.status(200).json(profissional); 

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar profissionais' });
    }
});

//excluir conta profissional 

//editar conta

// Supondo que você tenha um modelo Profissional já configurado no Prisma

app.put('/atualizar-profissional/:id', async (req, res) => {
    const { id } = req.params;  // Obtém o id do profissional da URL
    const { email, senha, telefone, cidade } = req.body;  // Recebe os dados para atualização

    try {
        // Atualiza os dados no banco de dados
        const profissionalAtualizado = await prisma.profissional.update({
            where: { id: id },
            data: {
                email: email,
                senha: senha,
                telefone: telefone,
                cidade: cidade
            }
        });

        res.status(200).json(profissionalAtualizado); // Retorna o profissional atualizado
    } catch (error) {
        console.error('Erro ao atualizar o profissional:', error);
        res.status(500).json({ error: 'Erro ao atualizar o profissional' });
    }
});


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

app.post('/contratante/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Encontrar o contratante no banco de dados com email e senha
        const contratante = await prisma.user.findFirst({
            where: {
                email: email,  // Nome do administrador
                senha: senha,  // Senha fornecida
            },
        });

        // Verificar se o contratante foi encontrado
        if (!contratante) {
            return res.status(404).json({ message: 'Perfil não encontrado ou credenciais incorretas' });
        }

        // Retornar todos os dados do contratante
        res.status(200).json({
            message: 'Login de contratante bem-sucedido!',
            contratante: {
                id: contratante.id,
                email: contratante.email,
                telefone: contratante.telefone,
                cidade: contratante.cidade,
                createdAt: contratante.createdAt,
            },
        });
    } catch (error) {
        console.error('Erro ao tentar logar como contratante:', error);
        res.status(500).json({ error: 'Erro ao tentar logar como contratante', detalhes: error.message });
    }
});


//pegar dados do usuario

app.get('/get-contratantes', async (req, res) => {
    try {
        const contratantes = await prisma.user.findMany();  // 
        
        res.status(200).json(contratantes); 

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar contratantes' });
    }
});
  

// excluir conta como contratante

// editar conta contratante

// Exemplo com Express e Prisma

app.put('/atualizar-contratante/:id', async (req, res) => {
    const { id } = req.params;  // Obtém o id do contratante da URL
    const { email, senha, telefone, cidade } = req.body;  // Recebe os dados para atualização

    try {
        // Atualiza os dados no banco de dados
        const contratanteAtualizado = await prisma.user.update({
            where: { id: id },
            data: {
                email: email,
                senha: senha,
                telefone: telefone,
                cidade: cidade
            }
        });

        res.status(200).json(contratanteAtualizado); // Retorna o contratante atualizado
    } catch (error) {
        console.error('Erro ao atualizar o contratante:', error);
        res.status(500).json({ error: 'Erro ao atualizar o contratante' });
    }
});


// ajuda e suporte

app.post('/ajuda', async (req, res)=> {
    try {
        const ajuda = await prisma.ajuda.create({
            data: {
                email: req.body.email,
                detalhes: req.body.detalhes,

            }
        })

        res.status(200).json({message: 'mensagem enviada com sucesso'})
    } catch (error) {
        res.status(500).json({message: 'Erro ao tentar entrar em contato'})
    }
})

//pegar ajuda e suporte





// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

