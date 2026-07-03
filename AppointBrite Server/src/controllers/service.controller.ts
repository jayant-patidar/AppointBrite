import { Request, Response } from 'express';
import { Service } from '../models/service.model';
import { Business } from '../models/business.model';

export const getMyServices = async (req: Request, res: Response): Promise<void> => {
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

    const services = await Service.find({ businessId: business._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
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

    const serviceData = { ...req.body, businessId: business._id };
    const newService = await Service.create(serviceData);
    
    res.status(201).json({ success: true, data: newService });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
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

    const service = await Service.findOne({ _id: req.params.id, businessId: business._id });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found or unauthorized' });
      return;
    }

    Object.assign(service, req.body);
    await service.save();

    res.status(200).json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
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

    const service = await Service.findOneAndDelete({ _id: req.params.id, businessId: business._id });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found or unauthorized' });
      return;
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
