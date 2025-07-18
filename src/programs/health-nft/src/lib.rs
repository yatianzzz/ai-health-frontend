use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, MintTo, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("92Pjex4KpuAx5kLu58ke2aZZhB8yq3Zfa1j6hY8Q4sVE");

#[program]
pub mod health_nft {
    use super::*;

    pub fn mint_health_nft(
        ctx: Context<MintHealthNFT>,
        nft_metadata: NftMetadata,
        health_data: HealthData,
    ) -> Result<()> {
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, 1)?;

        // Store health data
        let health_record = &mut ctx.accounts.health_record;
        health_record.owner = ctx.accounts.payer.key();
        health_record.nft_mint = ctx.accounts.mint.key();
        health_record.nft_type = nft_metadata.nft_type;
        health_record.health_data = health_data;
        health_record.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn deposit_nft(ctx: Context<DepositNFT>) -> Result<()> {
        let user_record = &mut ctx.accounts.user_record;
        user_record.owner = ctx.accounts.owner.key();
        user_record.on_chain_nfts.push(ctx.accounts.nft_mint.key());
        Ok(())
    }

    pub fn withdraw_nft(ctx: Context<WithdrawNFT>) -> Result<()> {
        let user_record = &mut ctx.accounts.user_record;
        user_record.on_chain_nfts.retain(|&x| x != ctx.accounts.nft_mint.key());
        Ok(())
    }

    pub fn transfer_nft(ctx: Context<TransferNFT>) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, 1)?;
        Ok(())
    }

    pub fn initialize_user_record(ctx: Context<InitializeUserRecord>) -> Result<()> {
        let user_record = &mut ctx.accounts.user_record;
        user_record.owner = ctx.accounts.owner.key();
        user_record.on_chain_nfts = Vec::new();
        user_record.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintHealthNFT<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = authority,
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = authority,
    )]
    pub token_account: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        space = 8 + HealthRecord::LEN,
    )]
    pub health_record: Account<'info, HealthRecord>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DepositNFT<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    pub nft_mint: Account<'info, Mint>,
    #[account(
        mut,
        seeds = [b"user_record", owner.key().as_ref()],
        bump,
    )]
    pub user_record: Account<'info, UserRecord>,
}

#[derive(Accounts)]
pub struct WithdrawNFT<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    pub nft_mint: Account<'info, Mint>,
    #[account(
        mut,
        seeds = [b"user_record", owner.key().as_ref()],
        bump,
    )]
    pub user_record: Account<'info, UserRecord>,
}

#[derive(Accounts)]
pub struct TransferNFT<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct InitializeUserRecord<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = 8 + UserRecord::LEN,
        seeds = [b"user_record", owner.key().as_ref()],
        bump,
    )]
    pub user_record: Account<'info, UserRecord>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct HealthRecord {
    pub owner: Pubkey,
    pub nft_mint: Pubkey,
    pub nft_type: String,
    pub health_data: HealthData,
    pub created_at: i64,
}

#[account]
pub struct UserRecord {
    pub owner: Pubkey,
    pub on_chain_nfts: Vec<Pubkey>,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct NftMetadata {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub nft_type: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct HealthData {
    pub exercise_records: u32,
    pub dietary_records: u32,
    pub total_records: u32,
}

impl HealthRecord {
    pub const LEN: usize = 32 + 32 + 4 + 50 + 4 + 4 + 4 + 8; // 各字段的大小
}

impl UserRecord {
    pub const LEN: usize = 32 + 4 + 32 * 10 + 8; // 支持最多10个NFT
}

#[error_code]
pub enum HealthNFTError {
    #[msg("Invalid NFT type")]
    InvalidNFTType,
    #[msg("Insufficient health records")]
    InsufficientHealthRecords,
    #[msg("NFT not found")]
    NFTNotFound,
} 