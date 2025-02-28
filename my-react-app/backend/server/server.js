import express from 'express';
import cors from 'cors';
import {Sequelize} from "sequelize";
import TodoModel from "../db/models/todo.js"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders:["Content-Type"]
}));

app.use(express.json());

const sequelize = new Sequelize('todolist', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize
    .authenticate()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('Unable to connect to PostgreSQL:', err))
sequelize.sync({force: false})
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error during synchronization:', err))

const Todo = TodoModel(sequelize, Sequelize.DataTypes)

app.get("/todos", async (req, res) => {
    try {
        const todos = await sequelize.query('SELECT * FROM "Todos"', {
            type: Sequelize.QueryTypes.SELECT,
        });
        res.json(todos)
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Ошибка получения Todos"});
    }
})

app.post("/todos" , async (req, res) => {
    try {
        const {description, completed} = req.body;
        if (!description) {
            return res.status(400).json({ error: "Описание обязательно" });
        }
        const newDescription = await Todo.create({
            description,
            completed: completed ?? false
            })
        res.status(201).json(newDescription)
    } catch (error) {
        console.error("Ошибка добавления заметки",error.message)
        res.status(500).json({error: "Ошибка при сохранении"})
    }
})

app.put('/todos/:id' , async (req, res) => {
    try {
        const {id} = req.params
        const {completed} = req.body;

        const todo = await Todo.findOne({where: {id : id}})
        if(!todo) {
            return res.status(404).json({message: "Заметка не найдена"});
        }
            todo.completed = completed;
            await todo.save();
            return res.json(todo)
        } catch (error) {
            console.error("Ошибка сервера при изменении статуса:", error)
            res.status(500).json({message: "Ошибка сервера при изменении статуса"})
        }
})

app.put('/todos/description/:id', async (req, res) => {
    console.log("Получен PUT запрос для описания, id =", req.params);
    try {
        const {id} = req.params;
        const {description} = req.body;

        const todo = await Todo.findOne({where : {id: id}})
        if (!todo) {
            return res.status(404).json({message: "Заметка не найдена"});
        }
        todo.description = description;
        await todo.save()
        return res.json(todo)
    } catch (error) {
        console.error("Ошибка сервера при изменении описания:", error)
        res.status(500).json({message: "Ошибка сервера при изменении описания"})
    }
})

app.delete('/todos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const todo = await Todo.findOne({where: {id}})
        if (!todo) {
            return res.status(404).json({ message: "Заметка не найдена" })
        }
        await todo.destroy()
        return res.json({ message: "Заметка успешно удалена" });
    } catch (error) {
        console.error("Ошибка удаления заметки:", error);
        res.status(500).json({ message: "Ошибка сервера при удалении" });
    }

})

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})