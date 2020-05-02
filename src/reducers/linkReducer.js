let today = new Date
const initialState = {
  transactions: [],
  accounts: [],
  monthTransactions: [],

  transactionsDisplay: [],
  accountsDisplay: [],
  monthDisplay: [],

  userView: null,
  typeView: null,
  accountView: null,
  // monthView: today.getMonth() + 1
  monthView: 4

}

export default function linkReducer(state=initialState, action){

  const handleAccountsDisplay = (accounts) => {
    if (state.userView){
      accounts = accounts.filter(account => account.user.username === state.userView)
    } 
    if (state.typeView){
      if (state.typeView === "debt"){ // credit and loan
        accounts = accounts.filter(account => account.type === "credit" || account.type === "loan")
      } else {
        accounts = accounts.filter(account => account.type === state.typeView) // investment or depository
      }
    }
    accounts = accounts.sort( (acc1, acc2) => acc1.type > acc2.type ? 1 : -1 )
    return accounts 
  }

  const handleTransactionsDisplay = (transactions, accounts) => {
    if (state.typeView){ //  accountsDisplay will already be filtered to account types selected and whatever else is set 
      let account_ids = accounts.map(account => account.account_id) // [account_ids]
      transactions = transactions.filter(transaction => account_ids.includes(transaction.account_id) )
    }
    if (state.userView){
      transactions = transactions.filter(transaction => transaction.user.username === state.userView)
    } 
    if (state.accountView){
      transactions = transactions.filter(transaction => transaction.account_id === state.accountView)
    }
    transactions = transactions.sort( (trans1, trans2) => trans1.date > trans2.date ? -1 : 1 )
    return transactions 
  }

  const handleMonthDisplay = (transactions) => {
    if (state.userView){
      transactions = transactions.filter(items => items.user.username === state.userView)
    } 
    transactions = transactions.sort( (trans1, trans2) => trans1.date > trans2.date ? -1 : 1 )
    return transactions
  }

  switch(action.type){

    case 'storeData': 
      let monthTransactions = action.data.transactions.filter(transaction => 
        parseInt(transaction.date.slice(5, 7)) === state.monthView
      )
      return{
        ...state,
        transactions: action.data.transactions,
        accounts: action.data.accounts,
        monthTransactions: monthTransactions
      }

    case 'addData':
      return {
        ...state,
        transactions: [...state.transactions, ...action.data.transactions],
        accounts: [...state.accounts, ...action.data.accounts],
      }

    case 'setUserView': 
      return {
        ...state,
        userView: action.username,
        accountView: null // dont hold on to account filter
      }

    case "setTypeView": 
      let typeView = action.filter
      if (typeView === state.typeView){typeView = null}  // toggle
      return {
        ...state,
        typeView: typeView,
        accountView: null // dont hold on to account filter
      }

    case "setAccountView": 

      let accountView = action.filter
      if (accountView === state.accountView){accountView = null} // toggle
      return {
        ...state,
        accountView: accountView
      }
    case "removeBank":
      let accounts = state.accounts.filter(account => account.item_id !== action.item_id)
      let transactions = state.transactions.filter(transaction => transaction.item_id !== action.item_id)
      return{
        ...state,
        accounts: accounts,
        transactions: transactions
      }

    case "handleDisplay":
      let accountsDisplay = handleAccountsDisplay(state.accounts)
      let transactionsDisplay = handleTransactionsDisplay(state.transactions, accountsDisplay) // i need to pass accounts to filter tran by typeView
      console.log("accounts", accountsDisplay)
      console.log("transactions", transactionsDisplay)
      return{
        ...state,
        transactionsDisplay: transactionsDisplay,
        accountsDisplay: accountsDisplay,
        // monthTransactions: handleMonthDisplay(state.monthTransactions) 
        monthDisplay: handleMonthDisplay(state.monthTransactions) 
      }
    case "setMonthView":
      return{
        ...state,
        monthView: action.month
      }
    case "storeMonth":
      return {
        ...state,
        monthTransactions: action.transactions
      }
    case "resetLink":
      return initialState;

    default: {
      return state
    }

  }



}
