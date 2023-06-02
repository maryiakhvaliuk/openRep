import { LightningElement, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import deleteAccountById from '@salesforce/apex/AccountController.deleteAccountById';

export default class AccountList extends NavigationMixin(LightningElement) {
  @track accounts;
  wiredAccountsResult;

  @wire(getAccounts)
  wiredAccounts(result) {
    this.wiredAccountsResult = result;
    if (result.data) {
      this.accounts = result.data;
    } else if (result.error) {
      console.error(result.error);
    }
  }

  createNewAccount() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Account',
        actionName: 'new'
      }
    });
  }


  refreshAccountList() {
    refreshApex(this.wiredAccountsResult);
  }

  editAccount(event) {
    const accountId = event.target.value;
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: accountId,
        objectApiName: 'Account',
        actionName: 'edit'
      }
    })
      .then(() => {
        return this.refreshAccountList(); 
      })
      .catch((error) => {
        console.error(error);
      });
  }
  

  deleteAccount(event) {
    const accountId = event.target.value;
    const confirmed = confirm('Are you sure you want to delete this account?');
    if (!confirmed) {
      return;
    }

    deleteAccountById({ accountId })
      .then(() => {
        return refreshApex(this.wiredAccountsResult);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  

  deleteAllAccounts() {
    if (!confirm('Are you sure you want to delete all accounts?')) {
      return;
    } 
    deleteAllAccounts()
      .then(() => {
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
