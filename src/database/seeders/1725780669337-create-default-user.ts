import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcryptjs';

const QUERY = `
    insert into "user" (id, full_name, user_name, email, password)
    values ($1, $2, $3, $4, $5)
    on conflict (id) do update set full_name = EXCLUDED.full_name, user_name = EXCLUDED.user_name, email = EXCLUDED.email, password = EXCLUDED.password
`;

const USERS = [
    {
        id: 1,
        full_name: 'Jon Snow',
        user_name: 'jon',
        email: 'alimnfog@gmail.com',
        password: bcrypt.hashSync('UCanKissMyWhiteNak3dAss!', 10),
    }
];

export class CreateDefaultUser1725780669337 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        for (const userData of USERS) {
            const { id, full_name, user_name, email, password } = userData;
            await queryRunner.query(QUERY, [id, full_name, user_name, email, password]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM "user"');
    }

}
