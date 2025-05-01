// transactionExample.js
const pool = require('./db');

async function doTransaction() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // 開始交易
    
    // 假設要同時將學生 'S10810005' 的系所由 CS001 換成 EE001
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    await conn.query(updateStudent, ['EE001', 'S10810005']);
    
    // 假設同時更新其他相關表格
    // 例如：更新學生選課表中的系所標記
    const updateCourses = 'UPDATE ENROLLMENT SET Status = ? WHERE Student_ID = ?';
    await conn.query(updateCourses, ['轉系', 'S10810005']);
    
    // 如果以上操作都成功，則提交交易
    await conn.commit();
    console.log('交易成功，已提交');
  } catch (err) {
    // 若有任何錯誤，回滾所有操作
    if (conn) await conn.rollback();
    console.error('交易失敗，已回滾：', err);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction();
