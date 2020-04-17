import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface ReturnAll {
  transactions: Transaction[];
  balance: Balance;
}
class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): ReturnAll {
    if (this.transactions === []) {
      throw Error('No transactions saved');
    }
    const balance = this.getBalance();

    return { transactions: this.transactions, balance };
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((previous, current) => {
      return current.type !== 'income' ? previous : previous + current.value;
    }, 0);

    const outcome = this.transactions.reduce((previous, current) => {
      return current.type !== 'outcome' ? previous : previous + current.value;
    }, 0);

    const balance = income - outcome;

    return {
      income,
      outcome,
      total: balance,
    };
  }

  public checkTransaction(outValue: number): boolean {
    const balance = this.getBalance();

    if (balance.total < outValue) {
      return false;
    }
    return true;
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    this.getBalance();

    return transaction;
  }
}

export default TransactionsRepository;
