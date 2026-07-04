import { Request, Response } from 'express';
import { Staff } from '../models/staff.model';
import { Business } from '../models/business.model';
import { User } from '../models/user.model';
import bcryptjs from 'bcryptjs';

export const getBusinessStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const business = await Business.findOne({ ownerId: req.user.userId });
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }

    const staffMembers = await Staff.find({ businessId: business._id })
      .populate('userId', 'firstName lastName email phoneNumber profileImage')
      .populate('providedServices', 'name duration price');

    res.status(200).json({ success: true, data: staffMembers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const business = await Business.findOne({ ownerId: req.user.userId });
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }

    const { firstName, lastName, email, phoneNumber, providedServices, workingHours, colorCode } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user for staff
      const generatedPassword = await bcryptjs.hash(Math.random().toString(36).slice(-10), 12);
      user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        phoneNumber,
        passwordHash: generatedPassword,
        role: 'STAFF',
      });
    }

    // Check if staff profile already exists for this business
    const existingStaff = await Staff.findOne({ userId: user._id, businessId: business._id });
    if (existingStaff) {
      res.status(400).json({ success: false, message: 'Staff member is already added to this business' });
      return;
    }

    // Default working hours to business operating hours if not provided
    const defaultWorkingHours = workingHours || business.operatingHours || [];

    const newStaff = await Staff.create({
      userId: user._id,
      businessId: business._id,
      providedServices: providedServices || [],
      workingHours: defaultWorkingHours,
      colorCode: colorCode || '#2563EB',
    });

    const populatedStaff = await newStaff.populate('userId', 'firstName lastName email phoneNumber profileImage');

    res.status(201).json({ success: true, data: populatedStaff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const business = await Business.findOne({ ownerId: req.user.userId });
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }

    const staff = await Staff.findOne({ _id: req.params.id, businessId: business._id });
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found or unauthorized' });
      return;
    }

    // Update staff-specific fields
    const { providedServices, workingHours, colorCode } = req.body;
    if (providedServices !== undefined) staff.providedServices = providedServices;
    if (workingHours !== undefined) staff.workingHours = workingHours;
    if (colorCode !== undefined) staff.colorCode = colorCode;

    await staff.save();
    
    // Also update User profile fields if they are provided
    const { firstName, lastName, phoneNumber } = req.body;
    if (firstName || lastName || phoneNumber) {
      const user = await User.findById(staff.userId);
      if (user) {
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        await user.save();
      }
    }

    const populatedStaff = await Staff.findById(staff._id)
      .populate('userId', 'firstName lastName email phoneNumber profileImage')
      .populate('providedServices', 'name duration price');

    res.status(200).json({ success: true, data: populatedStaff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const business = await Business.findOne({ ownerId: req.user.userId });
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }

    const staff = await Staff.findOneAndDelete({ _id: req.params.id, businessId: business._id });
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found or unauthorized' });
      return;
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
