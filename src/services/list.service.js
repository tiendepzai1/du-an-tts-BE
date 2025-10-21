import List from "../Model/list.model.js";
import Broad from "../Model/broad.model.js";
import mongoose from "mongoose";

class ListService {
  // Tạo list mới và cập nhật ownerBroad
  async createList(data) {
    const { listName, description, status, ownerBroad } = data;

    // Kiểm tra Broad tồn tại
    const broad = await Broad.findById(ownerBroad);
    if (!broad) throw new Error("Invalid board ID");

    // Tránh trùng tên list trong cùng board
    // const existingList = await List.findOne({ listName, ownerBroad });
    // if (existingList) throw new Error("List name already exists in this board");

    const newList = await List.create({ listName, description, status, ownerBroad });

    broad.ownerList.push(newList._id);
    await broad.save();

    return newList;
  }

  async getAllLists() {
    return await List.find()
      .populate("ownerBroad", "broadName")
      .populate("ownerCard", "cardName status");
  }

  async getListById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid list ID");
    return await List.findById(id)
      .populate("ownerBroad", "broadName")
      .populate("ownerCard", "cardName status");
  }
  async updateList(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid list ID");

    const { listName, description, status, ownerBroad } = data;

    // Kiểm tra Broad tồn tại (nếu ownerBroad được cập nhật)
    if (ownerBroad) {
      const broad = await Broad.findById(ownerBroad);
      if (!broad) throw new Error("Invalid board ID");
    }

    const updatedList = await List.findByIdAndUpdate(
      id,
      { listName, description, status, ownerBroad },
      { new: true, runValidators: true }
    )
      .populate("ownerBroad", "broadName")
      .populate("ownerCard", "cardName status");

    if (!updatedList) throw new Error("List not found");

    return updatedList;
  }

  async deleteList(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid list ID");

    const list = await List.findById(id);
    if (!list) return null;

    // Xóa reference khỏi Broad.ownerList
    await Broad.findByIdAndUpdate(list.ownerBroad, { $pull: { ownerList: list._id } });

    await List.findByIdAndDelete(id);
    return list;
  }

  async getListsByBroadId(broadId) {
    if (!mongoose.Types.ObjectId.isValid(broadId)) throw new Error("Invalid board ID");

    return await List.find({ ownerBroad: broadId })
      .populate("ownerBroad", "broadName")
      .populate("ownerCard", "cardName description dueDate status"); // ✅ THÊM description + dueDate
  }

}

export default new ListService();
