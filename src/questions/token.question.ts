import { Question, QuestionSet } from 'nest-commander';
import { QuestionEnum } from '../enums/question.enum';

@QuestionSet({
  name: QuestionEnum.TOKEN,
})
export class TokenQuestion {
  @Question({
    name: 'token',
    message: 'Qual o seu token da OpenIA?',
    type: 'password',
  })
  parseValue(value: string): string {
    return value.trim();
  }
}
