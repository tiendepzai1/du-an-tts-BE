import ListService from "../services/list.service.js";

class ListController {
  async createList(req, res) {
    try {
      const list = await ListService.createList(req.body);
      res.status(201).json({ success: true, data: list, message: "List created successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllLists(req, res) {
    try {
      const lists = await ListService.getAllLists();
      res.status(200).json({ success: true, data: lists, message: "Lists retrieved successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getListById(req, res) {
    try {
      const list = await ListService.getListById(req.params.id);
      if (!list) return res.status(404).json({ success: false, message: "List not found" });
      res.status(200).json({ success: true, data: list, message: "List retrieved successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateList(req, res) {
    try {
      const list = await ListService.updateList(req.params.id, req.body);
      if (!list) return res.status(404).json({ success: false, message: "List not found" });
      res.status(200).json({ success: true, data: list, message: "List updated successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteList(req, res) {
    try {
      const list = await ListService.deleteList(req.params.id);
      if (!list) return res.status(404).json({ success: false, message: "List not found" });
      res.status(200).json({ success: true, message: "List deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getListsByBroadId(req, res) {
    try {
      const lists = await ListService.getListsByBroadId(req.params.broadId);
      res.status(200).json({ success: true, data: lists, message: "Lists retrieved successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new ListController();
