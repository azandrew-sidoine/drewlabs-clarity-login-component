import { Subscription } from "rxjs";

/** @description Cancel the list of subscritions */
export function cancelSubscriptions(_subscriptions: Subscription[]) {
  for (const subscription of _subscriptions) {
    subscription.unsubscribe();
  }
}
