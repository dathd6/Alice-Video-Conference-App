"use strict";
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
exports.RelationshipV21619781064584 = void 0;
class RelationshipV21619781064584 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
        insert into public.relationship ("userId2", "userId1", type) values (51, 4, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 6, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 12, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 33, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 29, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 47, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 10, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 15, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 40, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 38, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 35, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 17, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 16, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 24, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 43, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 9, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 13, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 26, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 18, 'follow');
    `);
        });
    }
    down(_) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.RelationshipV21619781064584 = RelationshipV21619781064584;
//# sourceMappingURL=1619781064584-Relationship_v2.js.map