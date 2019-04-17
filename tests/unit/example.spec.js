import { posStringToNumber } from "../../lib/posStringToNumber";



it('test',()=>{
  let object = {
    left:'30px',
    right:'40px',
    top:30
  }
  let result = posStringToNumber(object)
  expect(result.left).toBe(30);
  expect(result.right).toBe(40);
  expect(result.top).toBe(30);
})

