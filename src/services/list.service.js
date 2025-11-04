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

    // Dữ liệu data chứa: listName, description, status, ownerBroad, và quan trọng nhất là ownerCard (mảng ID mới)

    // Kiểm tra Broad tồn tại (nếu ownerBroad được cập nhật)
    if (data.ownerBroad) {
      const broad = await Broad.findById(data.ownerBroad);
      if (!broad) throw new Error("Invalid board ID");
    }

    // ✅ FIX: SỬ DỤNG $set: data để lưu trữ mảng ownerCard mới
    const updatedList = await List.findByIdAndUpdate(
      id,
      { $set: data }, // <-- Thay thế object cũ bằng { $set: data }
      { new: true, runValidators: true }
    )
      .populate("ownerBroad", "broadName")
      .populate("ownerCard", "cardName description dueDate status");

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
      .populate("ownerCard", "cardName description dueDate status");
  }

}

export default new ListService();