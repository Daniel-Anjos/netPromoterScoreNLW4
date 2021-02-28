import { EntityRepository, Repository } from "typeorm";
import { SurveyUsers } from "../models/SurveyUser";

@EntityRepository(SurveyUsers)
class SurveysUsersRepository extends Repository<SurveyUsers> { }

export { SurveysUsersRepository };