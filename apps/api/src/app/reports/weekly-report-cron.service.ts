import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportsService } from './reports.service';
import { DalService, UserRepository, OrganizationRepository, EnvironmentRepository, UserEntity, OrganizationEntity, EnvironmentEntity, MemberRepository, MemberEntity } from '@novu/dal';

@Injectable()
export class WeeklyReportCronService {
  private readonly logger = new Logger(WeeklyReportCronService.name);

  constructor(
    private reportsService: ReportsService,
    private dalService: DalService,
    private userRepository: UserRepository,
    private organizationRepository: OrganizationRepository,
    private environmentRepository: EnvironmentRepository,
    private memberRepository: MemberRepository,
  ) {}

  /**
   * Send weekly reports every Monday at 9:00 AM
   * Cron expression: 0 9 * * 1 (every Monday at 9 AM)
   */
  @Cron(CronExpression.EVERY_WEEK)
  async sendWeeklyReports() {
    this.logger.log('Starting weekly report generation and delivery...');

    try {
      // Get all organizations
      const organizations: OrganizationEntity[] = await this.organizationRepository.find({
        deleted: { $ne: true }, // Exclude deleted organizations
      });

      for (const organization of organizations) {
        try {
          // Get environments for this organization
          const environments: EnvironmentEntity[] = await this.environmentRepository.find({
            _organizationId: organization._id,
          });

          for (const environment of environments) {
            try {
              // Get members for this organization
              const members: MemberEntity[] = await this.memberRepository.find({
                _organizationId: organization._id,
              });

              for (const member of members) {
                try {
                  // Get user details for this member
                  const user = await this.userRepository.findById(member._userId);
                  if (!user) continue;

                  // Check if user has email preference for weekly reports
                  // For now, we'll send to all admin users
                  if (user.email) {
                    this.logger.log(`Sending weekly report to ${user.email} for organization ${organization.name}`);
                    
                    await this.reportsService.generateWeeklyReportEmail(
                      environment._id.toString(),
                      organization._id.toString(),
                      user._id.toString(),
                      user.email
                    );

                    this.logger.log(`Weekly report sent successfully to ${user.email}`);
                  }
                } catch (userError) {
                  this.logger.error(`Failed to send weekly report to user:`, userError);
                  // Continue with other users
                }
              }
            } catch (environmentError) {
              this.logger.error(`Failed to process environment ${environment.name}:`, environmentError);
              // Continue with other environments
            }
          }
        } catch (organizationError) {
          this.logger.error(`Failed to process organization ${organization.name}:`, organizationError);
          // Continue with other organizations
        }
      }

      this.logger.log('Weekly report generation and delivery completed');
    } catch (error) {
      this.logger.error('Failed to send weekly reports:', error);
    }
  }

  /**
   * Manual trigger for weekly reports (for testing or immediate delivery)
   */
  async triggerWeeklyReports(organizationId?: string, environmentId?: string, userId?: string) {
    this.logger.log('Manually triggering weekly reports...');

    try {
      let organizations: OrganizationEntity[] = [];
      
      if (organizationId) {
        // Send to specific organization
        const organization = await this.organizationRepository.findById(organizationId);
        if (organization && !organization.deleted) {
          organizations = [organization];
        }
      } else {
        // Send to all organizations
        organizations = await this.organizationRepository.find({
          deleted: { $ne: true },
        });
      }

      for (const organization of organizations) {
        try {
          let environments: EnvironmentEntity[] = [];
          
          if (environmentId) {
            // Send to specific environment
            const environment = await this.environmentRepository.findOne({ _id: environmentId });
            if (environment && environment._organizationId.toString() === organization._id.toString()) {
              environments = [environment];
            }
          } else {
            // Send to all environments for this organization
            environments = await this.environmentRepository.find({
              _organizationId: organization._id,
            });
          }

          for (const environment of environments) {
            try {
              let users: UserEntity[] = [];
              
              if (userId) {
                // Send to specific user
                const user = await this.userRepository.findById(userId);
                if (user) {
                  // Check if user is a member of this organization
                  const member = await this.memberRepository.findOne({
                    _userId: user._id,
                    _organizationId: organization._id,
                  });
                  if (member) {
                    users = [user];
                  }
                }
              } else {
                // Get all members for this organization and their user details
                const members: MemberEntity[] = await this.memberRepository.find({
                  _organizationId: organization._id,
                });
                
                for (const member of members) {
                  const user = await this.userRepository.findById(member._userId);
                  if (user) {
                    users.push(user);
                  }
                }
              }

              for (const user of users) {
                try {
                  if (user.email) {
                    this.logger.log(`Sending weekly report to ${user.email} for organization ${organization.name}`);
                    
                    await this.reportsService.generateWeeklyReportEmail(
                      environment._id.toString(),
                      organization._id.toString(),
                      user._id.toString(),
                      user.email
                    );

                    this.logger.log(`Weekly report sent successfully to ${user.email}`);
                  }
                } catch (userError) {
                  this.logger.error(`Failed to send weekly report to user ${user.email}:`, userError);
                }
              }
            } catch (environmentError) {
              this.logger.error(`Failed to process environment ${environment.name}:`, environmentError);
            }
          }
        } catch (organizationError) {
          this.logger.error(`Failed to process organization ${organization.name}:`, organizationError);
        }
      }

      this.logger.log('Manual weekly report trigger completed');
    } catch (error) {
      this.logger.error('Failed to trigger weekly reports:', error);
      throw error;
    }
  }
} 
