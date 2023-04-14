"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Schedule_1 = require("./Schedule");
const UserSchedule_1 = require("./UserSchedule");
const Transcript_1 = require("./Transcript");
const UserDocument_1 = require("./UserDocument");
const Notification_1 = require("./Notification");
const Message_1 = require("./Message");
let User = class User extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.updatedAt = new Date();
    }
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "fullname", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({
        default: "https://st.gamevui.com/images/image/2020/09/17/AmongUs-Avatar-maker-hd01.jpg",
    }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({
        default: "http://www.innersloth.com/Images/GAMES/AmongUs/banner_AmongUs.jpg",
    }),
    __metadata("design:type", String)
], User.prototype, "banner", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "timeSpend", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "joined", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "cancel", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "document", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.OneToMany(() => Schedule_1.Schedule, (schedule) => schedule.host),
    __metadata("design:type", Array)
], User.prototype, "hostMeeting", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserSchedule_1.UserSchedule, (schedule) => schedule.user),
    __metadata("design:type", Array)
], User.prototype, "schedules", void 0);
__decorate([
    typeorm_1.OneToMany(() => Transcript_1.Transcript, (transcript) => transcript.user),
    __metadata("design:type", Array)
], User.prototype, "transcripts", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserDocument_1.UserDocument, (document) => document.user),
    __metadata("design:type", Array)
], User.prototype, "documents", void 0);
__decorate([
    typeorm_1.OneToMany(() => Notification_1.Notification, (notification) => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    typeorm_1.OneToMany(() => Message_1.Message, (message) => message.user),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map