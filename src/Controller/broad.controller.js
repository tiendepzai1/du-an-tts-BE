import e from "express";
import Broad from "../Model/broad.model.js";



export const BroadCreate = async (req, res) => {
  try {
    const { broadName } = req.body
    const UserId = req.body.id

    if (!broadName) {
      return res.status(400).json({
        message: "broadName k được bỏ trống"
      })
    }

    const broadCheck = await Broad.findOne({ broadName: req.body.broadName })
    if (broadCheck) {
      return res.status(400).json({
        message: "tên broad đã tồn tại"
      })
    }

    const broad = await Broad.create({
      broadName: req.body.broadName,
      description: req.body.description,
      owner: UserId,
    })
  } catch (error) {
    console.log(error)

  }
}

export const ListBroad = async (req, res) => {
  try {


    const checkBroad = await Broad.find();
    if (checkBroad === 0) {
      return res.status(200).json({ message: "k có broad nào" })
    }
    return res.status(200).json({
      data: checkBroad
    })
  } catch (error) {
    console.log("error")
  }

}
export const DeleteBroad = async (req, res) => {
  try {
    const { id } = req.params;
    const broad = await Broad.findById(id);
    if (!broad) {
      return res.status(404).json({
        message: "không tìm thấy id cần xóa"
      })
    }
    await Broad.findByIdAndDelete(id);
    return res.status(201).json({
      message: "xóa thành công"
    })

  } catch (error) {
    console.log(error)
  }
}

export const GetByIdBroad = async (req, res) => {

  const broadId = req.body.id
  if (!broadId) {
    return res.status(400).json({
      message: "không tìm thấy id"
    })
  }
  const broad = await Broad.findById(id)
  return res.status(201).json({
    message: "tìm kiếm theo id",
    data: user
  })
}

export const UpdateBroad = async (req, res) => {
  try {


    const broad = await Broad.findById(id)
    return res.status(201).json({
      data: broad
    })
    if (!broad) {
      return res.status(400).json({
        message: "id k tồn tại"
      })
    }
    broad.broadName = req.body.broadName || broadName;
    broad.description = req.body.description || broadName
    const saveBroad = await Broad.save()
    return res.status(201).json({
      message: "sửa thành công"

    })
  } catch (error) {
    console.log(error)

  }
}