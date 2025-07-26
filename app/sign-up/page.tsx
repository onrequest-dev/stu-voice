import React from 'react'

const SignUp = () => {
  return (
    <div>
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 300, margin: '0 auto' }}>
        <label>
            اسم المستخدم
            <input type="text" name="username" style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }} />
        </label>
        <label>
            كلمة السر
            <input type="password" name="password" style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }} />
        </label>
        <button type="submit" style={{ padding: '0.5rem', borderRadius: 4, border: 'none', background: '#0070f3', color: '#fff', cursor: 'pointer' }}>
            تسجيل
        </button>
    </form>
    </div>
  )
}

export default SignUp
