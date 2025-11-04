import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    // Workspace owner
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Workspace members
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Boards in this workspace
    boards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    }],
    // Workspace settings
    settings: {
        visibility: {
            type: String,
            enum: ['private', 'public'],
            default: 'private'
        },
        allowInvites: {
            type: Boolean,
            default: true
        },
        defaultBoardVisibility: {
            type: String,
            enum: ['private', 'workspace', 'public'],
            default: 'workspace'
        }
    },
    // Activity log
    activities: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        action: String,
        entityType: {
            type: String,
            enum: ['workspace', 'board', 'member']
        },
        entityId: mongoose.Schema.Types.ObjectId,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});

// Methods to manage members
WorkspaceSchema.methods.addMember = async function (userId, role = 'member') {
    if (!this.members.some(m => m.user.toString() === userId.toString())) {
        this.members.push({
            user: userId,
            role,
            joinedAt: new Date()
        });
        await this.save();
    }
};

WorkspaceSchema.methods.removeMember = async function (userId) {
    this.members = this.members.filter(m => m.user.toString() !== userId.toString());
    await this.save();
};

WorkspaceSchema.methods.changeMemberRole = async function (userId, newRole) {
    const member = this.members.find(m => m.user.toString() === userId.toString());
    if (member) {
        member.role = newRole;
        await this.save();
    }
};

// Method to add board
WorkspaceSchema.methods.addBoard = async function (boardId) {
    if (!this.boards.includes(boardId)) {
        this.boards.push(boardId);
        await this.save();
    }
};

// Method to remove board
WorkspaceSchema.methods.removeBoard = async function (boardId) {
    this.boards = this.boards.filter(b => b.toString() !== boardId.toString());
    await this.save();
};

// Method to add activity
WorkspaceSchema.methods.addActivity = async function (userId, action, entityType, entityId) {
    this.activities.push({
        user: userId,
        action,
        entityType,
        entityId,
        createdAt: new Date()
    });
    await this.save();
};

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;