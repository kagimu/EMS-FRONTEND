import { defineAbility } from '@casl/ability';

const abilities = JSON.parse(localStorage.getItem('abilities'))
const existingAbility = abilities ? abilities : []

export default defineAbility((can, cannot) => {
  existingAbility.forEach((ability) => {
      can(ability.action, ability.subject)
  });

});