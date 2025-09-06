import User from "@/models/User";

export const userRepository = {
  async findByUsername(username: string) {
    return User.findOne({ username });
  },
  async findByMatricNumber(matricNumber: string) {
    return User.findOne({ matric_number: matricNumber });
  },
  async findByEmail(email: string) {
    return User.findOne({ email });
  },
  async create(data: Partial<typeof User>) {
    return User.create(data);
  },
  async update(username: string, data: Partial<typeof User>) {
    return User.updateOne({ username }, data);
  },
};
