import { Column, CreateDateColumn, Entity, PrimaryColumn, TableForeignKey } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity("surveysUsers")
class SurveyUser {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    user_id: number;

    @Column()
    survey_id: number;

    @Column()
    value: number;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}

export { SurveyUser };
