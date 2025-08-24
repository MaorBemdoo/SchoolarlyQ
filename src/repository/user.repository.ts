import User from "@/models/User"
import connectDB from "@/utils/db"

export const userRepository = {
    async findByUsername(username: string){
        await connectDB()
        return User.findOne({ username })
    },
    async findByMatricNumber(matricNumber: string){
        await connectDB()
        return User.findOne({ matric_number: matricNumber })
    },
    async findByEmail(email: string){
        await connectDB()
        return User.findOne({ email })
    },
    async create(data: Partial<typeof User>){
        await connectDB()
        return User.create(data);
    },
    async update(username: string, data: Partial<typeof User>){
        await connectDB()
        return User.updateOne({ username }, data)
    }
}