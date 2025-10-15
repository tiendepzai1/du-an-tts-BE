import List from "../Model/list.model.js";

class ListService {
    async createList(data) {
        const list = new List(data);
        return await list.save();
    }

    async getAllLists() {
        return await List.find().populate("ownerBroad ownerCard");
    }

    async getListById(id) {
        return await List.findById(id).populate("ownerBroad ownerCard");
    }

    async updateList(id, data) {
        return await List.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteList(id) {
        return await List.findByIdAndDelete(id);
    }
}

export default new ListService();
