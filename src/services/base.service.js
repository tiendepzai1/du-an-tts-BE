import mongoose from "mongoose";

class BaseService {
    constructor(model, populateFields = []) {
        this.model = model;
        this.populateFields = populateFields;
    }

    async create(data) {
        const document = new this.model(data);
        const saved = await document.save();
        return this.populateFields.length > 0
            ? await saved.populate(this.populateFields)
            : saved;
    }

    async findAll(filter = {}) {
        const query = this.model.find(filter);
        return this.populateFields.length > 0
            ? await query.populate(this.populateFields)
            : await query;
    }

    async findById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }
        const query = this.model.findById(id);
        return this.populateFields.length > 0
            ? await query.populate(this.populateFields)
            : await query;
    }

    async update(id, data) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }
        const query = this.model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        return this.populateFields.length > 0
            ? await query.populate(this.populateFields)
            : await query;
    }

    async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }
        return await this.model.findByIdAndDelete(id);
    }

    async findOne(filter) {
        const query = this.model.findOne(filter);
        return this.populateFields.length > 0
            ? await query.populate(this.populateFields)
            : await query;
    }
}

export default BaseService;