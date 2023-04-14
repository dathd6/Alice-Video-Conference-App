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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationshipResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Relationship_1 = require("../entities/Relationship");
let RelationshipResolver = class RelationshipResolver {
    follow(sender, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId1 = sender < receiver ? sender : receiver;
            const userId2 = sender < receiver ? receiver : sender;
            let relationship;
            try {
                relationship = yield Relationship_1.Relationship.create({
                    userId1,
                    userId2,
                    type: `${sender}`,
                }).save();
            }
            catch (err) {
                console.log(err);
                relationship = null;
            }
            if (relationship)
                return true;
            else
                return false;
        });
    }
    accept(sender, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId1 = sender < receiver ? sender : receiver;
            const userId2 = sender < receiver ? receiver : sender;
            yield Relationship_1.Relationship.update({ userId1, userId2 }, {
                type: "follow",
            });
            return true;
        });
    }
    unfollow(sender, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId1 = sender < receiver ? sender : receiver;
            const userId2 = sender < receiver ? receiver : sender;
            yield Relationship_1.Relationship.delete({
                userId1,
                userId2,
            });
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("sender")),
    __param(1, type_graphql_1.Arg("receiver")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RelationshipResolver.prototype, "follow", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("sender")),
    __param(1, type_graphql_1.Arg("receiver")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RelationshipResolver.prototype, "accept", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("sender")),
    __param(1, type_graphql_1.Arg("receiver")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RelationshipResolver.prototype, "unfollow", null);
RelationshipResolver = __decorate([
    type_graphql_1.Resolver(Relationship_1.Relationship)
], RelationshipResolver);
exports.RelationshipResolver = RelationshipResolver;
//# sourceMappingURL=relationship.js.map