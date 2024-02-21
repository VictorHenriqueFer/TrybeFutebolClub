import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const regexEmail = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (!regexEmail.test(email) || password.length <= 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next();
  }

  static auth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    const secret = process.env.JWT_SECRET || 'secret';

    try {
      const payload = jwt.verify(token, secret);
      res.locals.auth = payload;
      console.log(payload);
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
  }
}

export default Validations;
